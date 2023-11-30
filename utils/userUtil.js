const User = require("../models/User")

// fetch a use from the DB by discord ID
const fetchUserByDiscordId = async (discordId) => {
    const user = await User.findOne({ discordId: discordId })
    if(!user) {
        return null 
    } 
    return user
}

module.exports = { fetchUserByDiscordId }