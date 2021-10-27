const { customerVerification } = require('../middleware/tokenVerifier')
const CryptoJs = require('crypto-js')
const User = require('../models/User')

const Router = require('express').Router()

// manage user information
// update the user information

Router.put('/update/:id', customerVerification, async (req, response) => {
  // encrypt user password if he needs to change it
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY,
    ).toString()
  }
  //   continue the update actions
  try {
    let results = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }, // this is for returning the updated user
    )
    return response.json(results)
  } catch (error) {
    console.log(error)
  }
})

Router.get('/profile/:id', customerVerification, async (req, response) => {
  try {
    const user = await User.findById(req.params.id)
    response.status(200).json({ profile: user })
  } catch (error) {
    return response.json({
      message: 'someting went wrong',
      error,
    })
  }
})

module.exports = Router
