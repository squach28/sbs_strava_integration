const express = require('express')
const router = express.Router()
const { getMonthlyLeaderboard, getMonthlyLeaderboardByCategory } = require('../controllers/leaderboardController')

router.get('/month', getMonthlyLeaderboard)
router.get('/month/:category', getMonthlyLeaderboardByCategory)


module.exports = router 