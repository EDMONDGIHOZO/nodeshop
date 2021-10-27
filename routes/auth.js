const Router = require('express').Router()
const User = require('../models/User')
const CryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

Router.post('/register', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY,
    ).toString(),
  })
  //   save the new user
  let results = null
  try {
    results = await user.save()
    return res.status(201).json(results)
  } catch (error) {
    return res.status(500).json(error.toString())
  }
})
Router.post('/login', async (req, res) => {
  // verify the password
  try {
    const user = await User.findOne({ username: req.body.username })
    // notif user if the pwd is wrong
    !user &&
      res
        .status(404)
        .json({ message: 'we dont have this username in our database' })
    // continue if the user was found
    const hashedpwd = CryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_KEY,
    )
    const pwd = hashedpwd.toString(CryptoJs.enc.Utf8)
    // compare the pwd then
    pwd !== req.body.password &&
      res.status(401).json({ message: 'password did not match' })
    // remove the password from response
    const { password, ...more } = user._doc
    //   if everything is clear
    // create the jwt token
    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: '2d' },
    )
    return res.json({ user: more, jwt: accessToken })
  } catch (error) {
    console.log(error.response)
  }
})

module.exports = Router
