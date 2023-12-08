const fetch = require('node-fetch')
const Leaderboard = require('../models/Leaderboard')

const getLeaderboard = async (req, res) => {
    const timeframe = req.query.timeframe
    let leaderboard
    if(timeframe && timeframe.toLowerCase() === 'year') {
        leaderboard = await getYearlyLeaderboard()
    } else {
        leaderboard = await getMonthlyLeaderboard()
    }

    res.send(leaderboard)
}

const getMonthlyLeaderboard = async () => {
    const currentDate = new Date()
    const month = (currentDate.getMonth() + 1).toString() // month index starts at 0
    const year = currentDate.getFullYear().toString()
    const monthLeaderboard = await Leaderboard.findOne({
       month: month,
       year: year 
    })
    const users = monthLeaderboard.users.sort((a, b) => {
        if(a.distance > b.distance) {
            return -1
        } else {
            return 1
        }
    })
    return users
}

const getYearlyLeaderboard = async () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear().toString()
    const yearLeaderboard = await Leaderboard.find({
        year: year.toString()
    })
    const users = {} // map discord id to object containing numOfActivities and distance
    for(let leaderboard of yearLeaderboard) {
        for(let user of leaderboard.users) {
            const numOfActivities = user.numOfActivities
            const distance = user.distance
            const discordId = user.discordId
            if(user.discordId in users) {
                users[discordId].numOfActivities += numOfActivities
                users[discordId].distance += distance 
            } else {
                users[discordId] = {
                    discordId: discordId,
                    numOfActivities: numOfActivities,
                    distance: distance
                }
            }
        }
    }

    const usersArr = []

    for(let [_ , value] of Object.entries(users)) {
        usersArr.push(value)
    }
    usersArr.sort((a, b) => {
        if(a.distance > b.distance) {
            return -1
        } else {
            return 1
        }
    })

    return usersArr
}

const getMonthlyLeaderboardByCategory = async (req, res) => {
    
}

module.exports = { getLeaderboard }