const mongoose = require('mongoose')

const UserStatsSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    discordName: {
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
    },
    avatarUrl: {
        type: String
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
        type: [UserStatsSchema],
        require: true
    }
})
const UserStats = mongoose.model('UserStats', UserStatsSchema)
const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema)


module.exports = { UserStats, Leaderboard }