const { Leaderboard, UserStats } = require('../models/Leaderboard')
const User = require('../models/User')
const querystring = require('querystring')

const getUserActivities = async (discordId, before, after) => {
    const queryParams = {
        discordId: discordId,
        before: before,
        after: after
    }
    try {
        const activities = await fetch(`http://localhost:3001/user/activities?${querystring.stringify(queryParams)}`)
            .then(res => res.json())
            .then(data => data)
        return activities
    } catch(e) {
        console.log(e)
        res.status(500).json({ 'message': 'oopsie whoopsie'})
    }

}

const updateLeaderboard = async (req, res) => {
    const currentDate = new Date()
    const month = (currentDate.getMonth() + 1).toString()
    const year = currentDate.getFullYear().toString()
    
    const before = new Date(currentDate.getMonth() + 1 <= 11 ? currentDate.getFullYear() : currentDate.getFullYear() + 1,( currentDate.getMonth() + 1) % 11, 1).getTime() / 1000
    const after = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() / 1000
    try {
        const allActivities = []
        const users = await User.find({})
        const leaderboard = await Leaderboard.findOne({
            month: month,
            year: year
        })
        // TODO: iterate through each user and calculate the number of activities + total distance
        for(let user of users) {
            const activities = await getUserActivities(user.discordId, before, after)
            const activityInfo = {
                numOfActivities: 0,
                distance: 0,
                discordId: user.discordId,
                stravaId: user.stravaId
            }
            const result = activities.reduce((acc, curr) => {
                return {
                    distance: acc.distance + curr.distance,
                    numOfActivities: acc.numOfActivities + 1,
                    discordId: acc.discordId,
                    stravaId: acc.stravaId
                }
            }, activityInfo)
            allActivities.push(result)
        }

        for(let userActivity of allActivities) {
            const userStats = new UserStats(userActivity)
            leaderboard.users.push(userStats)
            console.log('pushed!')
        }
        
        res.status(200).json(allActivities)
    } catch(e) {
        console.log(e)
        res.status(500).json({ 'message': 'oopsie whoospie'})
    }
}

module.exports = { updateLeaderboard }