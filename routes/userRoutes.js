const express = require('express')
const router = express.Router()
const { getUserByDiscordId, getStatsByDiscordId, getActivitiesByDiscordId } = require('../controllers/userController')
const userExistsMiddleware = require('../middleware/userMiddleware')
const expiredTokenMiddleware = require('../middleware/tokenMIddleware')

// middleware to check that user exists and access token is valid 
router.use('/stats', userExistsMiddleware)
router.use('/stats', expiredTokenMiddleware)

router.get('/stats', getStatsByDiscordId)

router.use('/activities', userExistsMiddleware)
router.use('/activities', expiredTokenMiddleware)

router.get('/activities', getActivitiesByDiscordId)

router.get('/:discordId', getUserByDiscordId)



module.exports = router