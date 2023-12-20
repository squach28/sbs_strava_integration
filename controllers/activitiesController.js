const User = require('../models/User')
const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const querystring = require('querystring')
const { convertToMiles } = require('../utils/unitsConverter')

// get the activities of all users 
const getActivities = async (req, res) => {
    try {
        const users = await User.find({})
        const allActivities = []
        for(let user of users) {
            const accessToken = user.stravaAccessToken
            const response = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const activities = await response.json()
            activities.forEach(activity => {
                allActivities.push({
                    discordName: user.discordName,
                    avatarUrl: user.avatarUrl,
                    ...activity
                })
            })
        }
        allActivities.sort((a, b) => {
            const aDate = new Date(a.start_date)
            const bDate = new Date(b.start_date)
            if(aDate > bDate) {
                return -1
            } else {
                return 1
            }
        })
        res.send(allActivities)
    } catch(e) {
        console.log(e)
    }
    
}

// get activities based on a discord id
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

module.exports = { getActivities, getActivitiesByDiscordId }