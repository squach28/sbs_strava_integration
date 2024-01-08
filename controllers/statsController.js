const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const Activity = require('../models/Activity')

// provides stats for the user
// stats - number of activites and distance by activity and total number of activites and distance
const getStatsByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    try {
        const activities = await Activity.find({
            discordId: discordId
        })
        const stats = {}
        // take each activity and calculate the distance and numOfActivities
        for(let activity of activities) {
            const category = activity.category
            const distance = activity.distance
            if(!(category in stats)) {
                stats[category] = {
                    distance: 0,
                    numOfActivities: 0
                }
            }
            stats[category].numOfActivities += 1
            stats[category].distance += distance 
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