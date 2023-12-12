const User = require("../models/User")
const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const querystring = require('querystring')

const convertToMiles = (meters) => {
    const meterToMileConversion = 0.0006213712
    return Math.round(meters * meterToMileConversion)
}

// fetches a user from the DB with discord id
const getUserByDiscordId = async (req, res) => {
    const discordId = req.params.discordId
    const user = await User.findOne({ discordId: discordId})
    if(!user) {
        res.status(404).json("User not found")
    } else {
        res.status(200).json(user)
    }
}

// provides stats for the user
// stats - number of activites and distance by activity and total number of activites and distance
const getStatsByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    const accessToken = await getAccessToken(discordId)
    
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const activities = await response.json()
    const stats = {}
    for(let activity of activities) {
        const sportType = activity.sport_type
        const distance = convertToMiles(activity.distance)
        if(!(sportType in stats)) {
            stats[sportType] = {
                distance: 0,
                numOfActivities: 0
            }
        }
        stats[sportType].numOfActivities += 1
        stats[sportType].distance += distance 
    }
    const result = []
    for(let stat of Object.entries(stats)) {
        const resultStat = {
            category: stat[0],
            distance: stat[1].distance,
            numOfActivities: stat[1].numOfActivities
        }
        result.push(resultStat)
    }
    res.send(result)   
}

// gets user's activities by discord id
const getActivitiesByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    const category = req.query.category
    const accessToken = await getAccessToken(discordId)
    const before = req.query.before
    const after = req.query.after
    const queryParams = (before && after) ? {
        before: before,
        after: after
    } : null
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities${queryParams ? '?' + querystring.stringify(queryParams) : ''}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    let data = await response.json()
    if(category !== undefined) {
        data = data.filter(sport => {
            if(sport.sport_type.toLowerCase() === category.toLowerCase()) {
                return sport
            }
        })
    }
    data.forEach(activity => {
        activity.distance = convertToMiles(activity.distance)
    })
    res.send(data)
}



module.exports = { getUserByDiscordId, getStatsByDiscordId, getActivitiesByDiscordId }