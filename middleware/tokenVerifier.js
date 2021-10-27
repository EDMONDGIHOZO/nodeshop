const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  // receive the token from request head
  const authHeader = req.headers.token
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(403).json('Invalid token')
      req.user = user
      next()
    })
  } else {
    return res.status(422).json({
      message: 'you must authenticated',
    })
  }
}

const adminVerification = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      res
        .status(422)
        .json({ message: 'you must be an admin to do this action' })
    }
  })
}

const customerVerification = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next()
    } else {
      res.status(422).json({ message: 'we cant verify this account' })
    }
  })
}

module.exports = { verifyToken, adminVerification, customerVerification }
