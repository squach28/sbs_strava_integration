const User = require('../models/User')
const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const querystring = require('querystring')

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

module.exports = { getStatsByDiscordId }