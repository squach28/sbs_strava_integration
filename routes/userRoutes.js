const express = require('express')
const router = express.Router()
const { getUserByDiscordId, createUser, updateSessionId } = require('../controllers/userController')


router.get('/:discordId', getUserByDiscordId)
router.post('/createUser', createUser)
router.put('/updateSessionId', updateSessionId)



module.exports = router