const fetch = require('node-fetch')
const querystring = require('node:querystring')
require('dotenv').config()
const User = require('../models/User')
const path = require('path')

// gets a tokenn using oauth2 from strava and stores it in the db
// also takes away sessionId, marking that a user has completed registration
const exchangeToken = async (req, res) => {
    const code = req.query.code
    const sessionId = req.query.state
    const authTokenUrl = 'https://www.strava.com/oauth/token?'
    try {
        fetch(authTokenUrl + querystring.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code'
        }), { method: 'POST' })
            .then(result => result.json())
            .then(async data => {
                const userInfo = {
                    stravaId: data.athlete.id,
                    stravaAccessToken: data.access_token,
                    stravaRefreshToken: data.refresh_token,
                    stravaTokenExpiresAt: data.expires_at,
                }
                await User.updateOne({
                    sessionId: sessionId
                }, userInfo)
                await User.updateOne({
                    stravaId: data.athlete.id
                }, {
                    $unset: { sessionId: ''}
                })
                res.sendFile(path.join(__dirname, '../pages/exchangeTokenPage/index.html'))
            })
    } catch(e) {
        console.log(e)
    }
}


module.exports = { exchangeToken }