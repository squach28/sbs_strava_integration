const { isTokenExpired, generateNewAccessToken } = require("../utils/stravaAccessTokenUtil")

const expiredTokenMiddleware = async (req, res, next) => {
    const tokenExpired = isTokenExpired(req.stravaTokenExpiresAt)
    if(tokenExpired) {
        await generateNewAccessToken(req.stravaRefreshToken, req.stravaId)
    }
    next()
}

module.exports = expiredTokenMiddleware