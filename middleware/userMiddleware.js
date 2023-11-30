const { fetchUserByDiscordId } = require("../utils/userUtil")

// middleware to verify that the user exists in DB

const userExistsMiddleware = async (req, res, next) => {
    const discordId = req.query.discordId
    const user = await fetchUserByDiscordId(discordId)
    if(user === null) {
        res.status(404).json({ message: 'User is not registered'})
    } else { // user exists, pass stravaId, stravaTokenExpiresAt, and stravaRefreshToken into next request
        req.stravaId = user.stravaId 
        req.stravaTokenExpiresAt = user.stravaTokenExpiresAt
        req.stravaRefreshToken = user.stravaRefreshToken
        next()
    }
}

module.exports = userExistsMiddleware