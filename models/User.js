const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        unique: true,
    },
    stravaId: {
        type: Number,
        unique: true
    },
    stravaAccessToken: String,
    stravaRefreshToken: String,
    stravaTokenExpiresAt: Number,
})

const User = mongoose.model("User", UserSchema)

module.exports = User