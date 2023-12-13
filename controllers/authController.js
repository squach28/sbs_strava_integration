const fetch = require('node-fetch')
const querystring = require('node:querystring')
require('dotenv').config()
const User = require('../models/User')
const path = require('path')

// gets a token with info (strava_id, access_token, refresh_token, expires_at) and stores in DB
// TODO: instead of creating a new user, find the user with the discord id 
// enforce with the state query parameter to know which user to update
const exchangeToken = async (req, res) => {
    const code = req.query.code
    const discordId = req.query.discord_id
    const avatarUrl = req.query.state
    const authTokenUrl = 'https://www.strava.com/oauth/token?'

    const result = await fetch(authTokenUrl + querystring.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
    }), { method: 'POST' })
        .then(result => result.json())
        .then(async data => {
            // TODO: don't create a user, find the user with a specific id and update the strava id, access token, refresh token, and expires at 
            const userInfo = {
                discordId: discordId,
                stravaId: data.athlete.id,
                stravaAccessToken: data.access_token,
                stravaRefreshToken: data.refresh_token,
                stravaTokenExpiresAt: data.expires_at,
                avatarUrl: avatarUrl
            }
            const user = new User(userInfo)
            await user.save()
            res.sendFile(path.join(__dirname, '../pages/exchangeTokenPage/index.html'))
        })
}

const createUser = async (req, res) => {
    const body = req.body
    try {
        const user = new User(body)
        await user.save()
        res.status(200).json({ 'message': 'User was created' })
    } catch(e) {
        console.log(e)
        res.status(500).json({ 'message': 'Something went wrong, please try again later.' })
    }
}






module.exports = { exchangeToken, createUser }