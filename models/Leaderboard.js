const mongoose = require('mongoose')

const LeaderboardSchema = new mongoose.Schema({
    type: {
        type: String,
        require: true
    },
    users: {
        type: Array,
        require: true
    }
})

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema)

module.exports = Leaderboard