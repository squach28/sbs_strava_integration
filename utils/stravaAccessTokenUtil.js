// Util for checking expired tokens, getting access tokens, and generating new tokens

const User = require("../models/User");
const querystring = require('querystring')

// checks if a token is expired based on epoch time
const isTokenExpired = (expiresAt) => {
    const currentTime = Math.floor(new Date().getTime() / 1000)
    return currentTime >= expiresAt
}

// fetches a new access token from Strava API and updates the access token in DB
const generateNewAccessToken = async (refreshToken, stravaId) => {
    const getNewTokenUrl = 'https://www.strava.com/oauth/token?'
    await fetch(getNewTokenUrl + querystring.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }), { method: 'POST' })
        .then(res => res.json())
        .then(async data => {
            const accessToken = data.access_token 
            const refreshToken = data.refresh_token
            const expiresAt = data.expires_at
            const newTokenInfo = {
                stravaAccessToken: accessToken,
                stravaRefreshToken: refreshToken,
                stravaTokenExpiresAt: expiresAt
            }
            await User.findOneAndUpdate({ stravaId: stravaId }, newTokenInfo, { new: true} )
        })
        .catch(e => {
            console.error(e)
        })
}

// get the user's access token based on discord id from the db
const getAccessToken = async (discordId) => {
    const user = await User.findOne({ discordId: discordId })
    if(user === null) { // user doesn't exist
        return null
    }

    const currentUser = await User.findOne({ discordId: discordId })

    return currentUser.stravaAccessToken
}

module.exports = { isTokenExpired, getAccessToken, generateNewAccessToken }