const mongoose = require('mongoose')

const UserStats = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    stravaId: {
        type: String,
        required: true 
    },
    numOfActivities: {
        type: Number,
        required: true 
    },
    distance: {
        type: Number,
        required: true 
    }
})

const LeaderboardSchema = new mongoose.Schema({
    month: {
        type: String,
        require: true
    },
    year: {
        type: String,
        required: true
    },
    users: {
        type: [UserStats],
        require: true
    }
})

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema)

module.exports = Leaderboard