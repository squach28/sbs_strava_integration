const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        unique: true,
        required: true
    },
    stravaId: {
        type: Number,
        unique: true
    },
    stravaAccessToken: String,
    stravaRefreshToken: String,
    stravaTokenExpiresAt: Number,
    avatarUrl: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        unique: true
    }
})

const User = mongoose.model("User", UserSchema)

module.exports = User