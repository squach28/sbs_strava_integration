const fetch = require('node-fetch')
const Leaderboard = require('../models/Leaderboard')

const getMonthlyLeaderboard = async (req, res) => {
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
    res.send(users)
}

const getMonthlyLeaderboardByCategory = async (req, res) => {

}

module.exports = { getMonthlyLeaderboard, getMonthlyLeaderboardByCategory }