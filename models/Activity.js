const mongoose = require('mongoose')

const ActivitySchema = mongoose.Schema({
    stravaId: {
        type: String,
        required: true
    },
    discordId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    distance: {
        type: Number
     },
    category: {
        type: String
    },
    startDate: {
        type: String
    },
    elapsedTime: {
        type: String
    },
    timezone: {
        type: String
    }
})

const Activity = mongoose.model('Activity', ActivitySchema)

module.exports = Activity