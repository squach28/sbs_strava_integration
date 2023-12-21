const express = require('express')
const router = express.Router()
const { getLeaderboard, getAllTimeLeaderboard } = require('../controllers/leaderboardController')

router.get('/', getLeaderboard)
router.get('/allTime', getAllTimeLeaderboard)


module.exports = router 