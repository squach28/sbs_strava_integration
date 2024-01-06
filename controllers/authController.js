const fetch = require('node-fetch')
const querystring = require('node:querystring')
require('dotenv').config()
const User = require('../models/User')
const Activity = require('../models/Activity')
const path = require('path')
const { Leaderboard, UserStats } = require('../models/Leaderboard')
const { convertToMiles } = require('../utils/unitsConverter')
const { getAccessToken } = require("../utils/stravaAccessTokenUtil")

// adds user's activities into the leaderboard for user who has just signed up
const addUserActivitesForCurrentMonth = async (discordId, stravaId, accessToken) => {
    try {
        const currentDate = new Date()
        const month = ((currentDate.getMonth() % 13) + 1).toString()
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
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }

}

const addUserActivities = async (discordId, stravaId) => {
    const STRAVA_ATHLETE_ACTIVITES_API_URL = 'https://www.strava.com/api/v3/athlete/activities'
    try {
        const accessToken = await getAccessToken(discordId)
        const response = await fetch(STRAVA_ATHLETE_ACTIVITES_API_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const activities = await response.json()
        for(let activity of activities) {
            const name = activity.name
            const distance = activity.distance
            const category = activity.sport_type.toLowerCase()
            const startDate = activity.start_date
            const elapsedTime = activity.elapsed_time
            const timezone = activity.timezone
            await Activity.create({
                stravaId: stravaId,
                discordId: discordId,
                name: name,
                distance: distance,
                category: category,
                startDate: startDate,
                elapsedTime: elapsedTime,
                timezone: timezone
            })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({ 'message': 'Something went wrong, please try again later.'})
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
                if(data.message) {
                    res.sendFile(path.join(__dirname, '../pages/errorPage/index.html'))
                } else {
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
                    const discordId = user.discordId
                    const accessToken = user.stravaAccessToken
                    const stravaId = user.stravaId
                    await addUserActivitesForCurrentMonth(discordId, stravaId, accessToken)
                    await addUserActivities(discordId, stravaId)
                    res.sendFile(path.join(__dirname, '../pages/exchangeTokenPage/index.html'))
                }

            })
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}


module.exports = { exchangeToken }