const User = require("../models/User")

const convertToMiles = (meters) => {
    const meterToMileConversion = 0.0006213712
    return Math.round(meters * meterToMileConversion)
}

// fetches a user from the DB with discord id
const getUserByDiscordId = async (req, res) => {
    const discordId = req.params.discordId
    const user = await User.findOne({ discordId: discordId})
    if(!user) {
        res.status(404).json("User not found")
    } else {
        res.status(200).json(user)
    }
}



module.exports = { getUserByDiscordId }