const express = require('express')
const { exchangeToken, createUser } = require('../controllers/authController')
const router = express.Router()

router.get('/exchangeToken', exchangeToken)
router.post('/createUser', createUser)

module.exports = router
