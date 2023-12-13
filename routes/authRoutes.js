const express = require('express')
const { exchangeToken } = require('../controllers/authController')
const router = express.Router()

router.get('/exchangeToken', exchangeToken)

module.exports = router
