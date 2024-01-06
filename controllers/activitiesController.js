const User = require('../models/User')
const { getAccessToken } = require("../utils/stravaAccessTokenUtil")
const querystring = require('querystring')
const { convertToMiles } = require('../utils/unitsConverter')
const Activity = require('../models/Activity')

// get the activities of all users sorted by start date descending
const getActivities = async (req, res) => {
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



module.exports = { getActivities, getActivitiesByDiscordId, getRecentActivitiesByDiscordId }