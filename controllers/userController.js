const User = require("../models/User")

// fetches a user from the DB by discord id
const getUserByDiscordId = async (req, res) => {
    const discordId = req.params.discordId
    const user = await User.findOne({ discordId: discordId})
    if(!user) {
        res.status(404).json("User not found")
    } else {
        res.status(200).json(user)
    }
}

// creates a user based on request body
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

// update a user's session id by discord id
const updateSessionId = async (req, res) => {
    const discordId = req.query.discordId
    const sessionId = req.body
    try {
        const updatedUser = await User.findOneAndUpdate({
            discordId: discordId
        }, sessionId)
        res.send(updatedUser)
    } catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Something went wrong, please try again later.'})
    }
}



module.exports = { getUserByDiscordId, createUser, updateSessionId }