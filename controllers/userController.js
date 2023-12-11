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

// uses strava api to get stats about a user
const getStatsByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    const stravaId = req.stravaId
    const accessToken = await getAccessToken(discordId)

    const response = await fetch(`https://www.strava.com/api/v3/athletes/${stravaId}/stats`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const data = await response.json()
    res.send(data)   
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
        console.log(activity.distance)
        activity.distance = convertToMiles(activity.distance)
    })
    res.send(data)
}



module.exports = { getUserByDiscordId, getStatsByDiscordId, getActivitiesByDiscordId }