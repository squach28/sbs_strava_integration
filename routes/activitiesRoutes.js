const express = require('express')
const { getActivitiesByDiscordId, getAllActivities, getRecentActivitiesByDiscordId, getActivitiesByTimeframe } = require('../controllers/activitiesController')
const { userExistsMiddleware } = require('../middleware/userMiddleware')
const { expiredTokenMiddleware } = require('../middleware/tokenMiddleware')
const router = express.Router()

router.get('/all', getAllActivities)
router.use('/', userExistsMiddleware)
router.use('/', expiredTokenMiddleware)
router.get('/', getActivitiesByDiscordId)
router.get('/recent', getRecentActivitiesByDiscordId)
router.get('/timeframe', getActivitiesByTimeframe)

module.exports = router