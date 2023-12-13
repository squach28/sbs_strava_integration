const express = require('express')
const { getStatsByDiscordId } = require('../controllers/statsController')
const { userExistsMiddleware } = require('../middleware/userMiddleware')
const { expiredTokenMiddleware } = require('../middleware/tokenMiddleware')
const router = express.Router()

router.use('/', userExistsMiddleware)
router.use('/', expiredTokenMiddleware)
router.get('/', getStatsByDiscordId)

module.exports = router