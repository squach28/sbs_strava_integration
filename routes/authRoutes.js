const express = require('express')
const { exchangeToken, getNewAccessToken } = require('../controllers/authController')
const router = express.Router()

router.get('/exchangeToken', exchangeToken)


module.exports = router
