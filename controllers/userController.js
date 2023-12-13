const User = require("../models/User")

const convertToMiles = (meters) => {
    const meterToMileConversion = 0.0006213712
    return Math.round(meters * meterToMileConversion)
}

// fetches a user from the DB with discord id
const getUserByDiscordId = async (req, res) => {
    const discordId = req.params.discordId
    const user = await User.findOne({ discordId: discordId})
    if(!user) {
        res.status(404).json("User not found")
    } else {
        res.status(200).json(user)
    }
}

const createUser = async (req, res) => {
    const body = req.body
    try {
        const user = new User(body)
        await user.save()
        res.status(200).json({ 'message': 'User was created' })
    } catch(e) {
        console.log(e)
        res.status(500).json({ 'message': 'Something went wrong, please try again later.' })
    }
}

const updateSessionId = async (req, res) => {
    const discordId = req.query.discordId
    const sessionId = req.body
    console.log(req.body)
    try {
        const updatedUser = await User.findOneAndUpdate({
            discordId: discordId
        }, sessionId)
        res.send(updatedUser)
    } catch(e) {
        console.log(e)
    }
}



module.exports = { getUserByDiscordId, createUser, updateSessionId }