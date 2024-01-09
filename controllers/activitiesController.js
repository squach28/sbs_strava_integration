const User = require('../models/User')
const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const querystring = require('querystring')
const { convertToMiles } = require('../utils/unitsConverter')
const Activity = require('../models/Activity')

const STRAVA_ACTIVITES_API_URL = 'https://www.strava.com/api/v3/athlete/activities'

// get the activities of all users sorted by start date descending
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find({})
            .sort({ startDate: -1 })
        res.send(activities)
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}

// get activities based on a discord id
const getActivitiesByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    const category = req.query.category
    try {
        const filter = {
            discordId: discordId,
            category: category
        }
        if(filter.category === undefined) {
            delete filter.category
        } else {
            filter.category = filter.category.toLowerCase()
        }
        const activities = await Activity.find(filter)
        res.send(activities)
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}

// get 5 most recent activities for a user by discord id
const getRecentActivitiesByDiscordId = async (req, res) => {
    const discordId = req.query.discordId
    try {
        const recentActivities = await Activity.find({
            discordId: discordId
        })
            .sort({ startDate: -1 })
            .limit(5)
        res.send(recentActivities)
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}

const getActivitiesByTimeframe = async (req, res) => {
    const discordId = req.query.discordId
    const before = req.query.before
    const after = req.query.after
    console.log(discordId)
    try {
        const accessToken = await getAccessToken(discordId)
        const queryParams = {
            before: before,
            after: after
        }
        const response = await fetch(`${STRAVA_ACTIVITES_API_URL}?${querystring.stringify(queryParams)}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const activities = await response.json()
        res.send(activities)
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}



module.exports = { getAllActivities, getActivitiesByDiscordId, getRecentActivitiesByDiscordId, getActivitiesByTimeframe }