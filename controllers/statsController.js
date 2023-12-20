const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const { convertToMiles } = require('../utils/unitsConverter')

// provides stats for the user
// stats - number of activites and distance by activity and total number of activites and distance
const getStatsByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    try {
    const accessToken = await getAccessToken(discordId)
    
    const response = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const activities = await response.json() 
    const stats = {}
    // take each activity and calculate the distance and numOfActivities
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
    const result = [] // return an array of objects that contain category, distance, and numOfActivities
    for(let stat of Object.entries(stats)) {
        const resultStat = {
            category: stat[0],
            distance: stat[1].distance,
            numOfActivities: stat[1].numOfActivities
        }
        result.push(resultStat)
    }
    res.send(result)   
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}

module.exports = { getStatsByDiscordId }