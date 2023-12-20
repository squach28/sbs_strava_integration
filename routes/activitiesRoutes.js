const express = require('express')
const { getActivitiesByDiscordId, getActivities } = require('../controllers/activitiesController')
const { userExistsMiddleware } = require('../middleware/userMiddleware')
const { expiredTokenMiddleware } = require('../middleware/tokenMiddleware')
const router = express.Router()

router.get('/all', getActivities)
router.use('/', userExistsMiddleware)
router.use('/', expiredTokenMiddleware)
router.get('/', getActivitiesByDiscordId)

module.exports = router