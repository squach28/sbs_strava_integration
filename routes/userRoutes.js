const express = require('express')
const router = express.Router()
const { getUserByDiscordId, createUser, updateUser } = require('../controllers/userController')


router.get('/:discordId', getUserByDiscordId)
router.post('/createUser', createUser)
router.put('/updateUser', updateUser)



module.exports = router