const fetch = require('node-fetch')
const { Leaderboard } = require('../models/Leaderboard')


const monthMapping = {
    'jan': '1',
    'feb': '2',
    'march': '3',
    'april': '4',
    'may': '5',
    'june': '6',
    'july': '7',
    'aug': '8',
    'sept': '9',
    'oct': '10',
    'nov': '11',
    'dec': '12'
}

const validYears = ['2023', '2024']

const getLeaderboard = async (req, res) => {
    console.log(req.origin)
    const monthOrYear = req.query.monthOrYear
    const year = req.query.year
    let leaderboard
    try {
        if(monthOrYear && year) {
            leaderboard = await getMonthlyLeaderboard(monthOrYear, year)
        } else if(monthOrYear) {
            leaderboard = await getYearlyLeaderboard(monthOrYear)
        } else {
            leaderboard = await getMonthlyLeaderboard()
        }
        res.status(200).json(leaderboard)
    } catch(e) {
        console.log(e)
        res.status(400).json({ 'message': 'Invalid data' })
    }

}

const getMonthlyLeaderboard = async (month = (new Date().getMonth() + 1).toString(), year=(new Date().getFullYear()).toString()) => {
    if(month in monthMapping) {
        month = monthMapping[month]
    }
    try {
        const monthLeaderboard = await Leaderboard.findOne({
            month: month,
            year: year
        })    
        monthLeaderboard.users.sort((a, b) => {
             if(a.distance > b.distance) {
                 return -1
             } else {
                 return 1
             }
         })
         return monthLeaderboard
    } catch(e) {
        return {
            'message': 'invalid data'
        }
    }

}

const getYearlyLeaderboard = async (year) => {
    try {
        const yearLeaderboard = await Leaderboard.find({
            year: year
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

        const leaderboard = {
            year: year,
            users: usersArr
        }
    
        return leaderboard
    } catch(e) {
        console.log(e)
    }

}

const getMonthlyLeaderboardByCategory = async (req, res) => {
    
}

module.exports = { getLeaderboard }