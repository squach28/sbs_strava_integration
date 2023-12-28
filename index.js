const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const leaderboardRoutes = require('./routes/leaderboardRoutes.js')
const statsRoutes = require('./routes/statsRoutes.js')
const activitesRoutes = require('./routes/activitiesRoutes.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const { updateLeaderboard } = require('./functions/leaderboardUpdate.js')

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.6dvxunc.mongodb.net/sbs-strava?retryWrites=true&w=majority` // uri to connect to mongo DB
app.use(cors())
app.use(bodyParser.json())
app.use('/user', userRoutes)
app.use('/stats', statsRoutes)
app.use('/activities', activitesRoutes)
app.use('/auth', authRoutes)
app.use('/leaderboard', leaderboardRoutes)
app.use(express.static(__dirname + '/pages/exchangeTokenPage'))
app.use(express.static(__dirname + '/pages/errorPage'))


app.listen(process.env.PORT || 3001, async () => {
    console.log(`listening on ${process.env.PORT || 3001}`);
    await mongoose.connect(uri) 
})


