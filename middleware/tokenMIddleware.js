const { isTokenExpired, generateNewAccessToken } = require("../utils/stravaAccessTokenUtil")
// muiddlware to generate a new token with the strava refresh token if current one ins expired
const expiredTokenMiddleware = async (req, res, next) => {
    const tokenExpired = isTokenExpired(req.stravaTokenExpiresAt)
    if(tokenExpired) {
        await generateNewAccessToken(req.stravaRefreshToken, req.stravaId)
    }
    next()
}

module.exports = { expiredTokenMiddleware }