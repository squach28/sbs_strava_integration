const fetch = require('node-fetch')
const querystring = require('node:querystring')
require('dotenv').config()
const User = require('../models/User')
const path = require('path')
const { Leaderboard, UserStats } = require('../models/Leaderboard')
const { convertToMiles } = require('../utils/unitsConverter')


const addUserActivitesForCurrentMonth = async (discordId, stravaId, accessToken) => {
    try {
        const currentDate = new Date()
        const month = ((currentDate.getMonth() + 1) % 12).toString()
        const year = currentDate.getFullYear().toString()
        const before = new Date(currentDate.getMonth() + 1 <= 11 ? currentDate.getFullYear() : currentDate.getFullYear() + 1,( currentDate.getMonth() + 1) % 11, 1).getTime() / 1000
        const after = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() / 1000
        const queryParams = {
            before: before,
            after: after
        }
        const res = await fetch(`https://www.strava.com/api/v3/athlete/activities${queryParams ? '?' + querystring.stringify(queryParams) : ''}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const activities = await res.json()
        const activityInfo = {
            numOfActivities: 0,
            distance: 0,
            discordId: discordId,
            stravaId: stravaId
        }
        const result = activities.reduce((acc, curr) => {
            return {
                distance: acc.distance + curr.distance,
                numOfActivities: acc.numOfActivities + 1,
                discordId: acc.discordId,
                stravaId: acc.stravaId
            }
        }, activityInfo)
        result.distance = convertToMiles(result.distance)
        const userStats = new UserStats(result)
        const update = {
            $push: { users: userStats }
        }
        const options = { upsert: true}
        await Leaderboard.findOneAndUpdate({
            month: month,
            year: year
        }, update, options)

    } catch(e) {
        console.log(e)
    }

}

// gets a token using oauth2 from strava and stores it in the db
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
                const user = await User.findOneAndUpdate({
                    stravaId: data.athlete.id
                }, {
                    $unset: { sessionId: ''}
                }, {
                    new: true
                })
                console.log(user)
                const discordId = user.discordId
                const accessToken = user.stravaAccessToken
                const stravaId = user.stravaId
                await addUserActivitesForCurrentMonth(discordId, stravaId, accessToken)
                res.sendFile(path.join(__dirname, '../pages/exchangeTokenPage/index.html'))
            })
    } catch(e) {
        console.log(e)
    }
}


module.exports = { exchangeToken }