const fetch = require('node-fetch')
const Leaderboard = require('../models/Leaderboard')


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
    const timeframe = req.query.timeframe
    const timeframeYear = req.query.timeframe_year
    let leaderboard
    
    try {
        if(timeframe) {
            console.log('year')
            leaderboard = await getYearlyLeaderboard(timeframe)
        }else if(timeframe && timeframeYear) {
            console.log('month with params')
            leaderboard = await getMonthlyLeaderboard(timeframe, timeframeYear)
        } else {
            console.log('month')
            leaderboard = await getMonthlyLeaderboard()
        }
        res.status(200).json(leaderboard)
    } catch(e) {
        console.log(e)
        res.status(400).json({ 'message': 'Month is not valid' })
    }

}

const getMonthlyLeaderboard = async (month = (new Date().getMonth() + 1).toString(), year=(new Date().getFullYear()).toString()) => {
    if(!(month in monthMapping) && month !== (new Date().getMonth() + 1).toString()) {
        throw new Error('Month is not valid')
    }
    console.log(month)
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
    
        return usersArr
    } catch(e) {
        console.log(e)
    }

}

const getMonthlyLeaderboardByCategory = async (req, res) => {
    
}

module.exports = { getLeaderboard }