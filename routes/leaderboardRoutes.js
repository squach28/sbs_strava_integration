const express = require('express')
const router = express.Router()
const { getMonthlyLeaderboard, getMonthlyLeaderboardByCategory, testDatabase } = require('../controllers/leaderboardController')

router.get('/month', getMonthlyLeaderboard)
router.get('/month/:category', getMonthlyLeaderboardByCategory)


module.exports = router 