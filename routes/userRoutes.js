const express = require('express')
const router = express.Router()
const { getUserByDiscordId } = require('../controllers/userController')

router.get('/:discordId', getUserByDiscordId)



module.exports = router