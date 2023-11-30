const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.6dvxunc.mongodb.net/sbs-strava?retryWrites=true&w=majority` // uri to connect to mongo DB

app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use(express.static(__dirname + '/pages/exchangeTokenPage'))

app.listen(process.env.PORT || 3001, async () => {
    console.log(`listening on ${process.env.PORT || 3001}`);
    await mongoose.connect(uri) 
})


