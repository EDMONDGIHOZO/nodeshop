const { adminVerification } = require('../middleware/tokenVerifier')
const User = require('../models/User')

const Router = require('express').Router()

// get all users
Router.get('/all', adminVerification, async (req, response) => {
  try {
    const user = await User.find()
    response.status(200).json({ users: user })
  } catch (error) {
    return response.json({
      message: 'someting went wrong',
      error,
    })
  }
})

module.exports = Router
