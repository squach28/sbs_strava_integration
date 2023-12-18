const { fetchUserByDiscordId } = require("../utils/userUtil")

// middleware to verify that the user exists in DB

const userExistsMiddleware = async (req, res, next) => {
    const discordId = req.query.discordId
    const user = await fetchUserByDiscordId(discordId)
    if(user === null) {
        res.status(404).json({ message: 'User not found, use the /register command to connect your Strava account.' })
    } else { // user exists, pass stravaId, stravaTokenExpiresAt, and stravaRefreshToken into next request
        if(user.sessionId) { // user exists, but sessionId is present -> user hasn't completed oauth2
            res.status(403).json({ message: 'User found with incomplete registration. Please use the link sent in your DM to finish registration or start a new registration with the /register command.'})
        } else {
            req.stravaId = user.stravaId 
            req.stravaTokenExpiresAt = user.stravaTokenExpiresAt
            req.stravaRefreshToken = user.stravaRefreshToken
            next()
        }

    }
}

module.exports = { userExistsMiddleware }