const Mongoose = require('mongoose')

const UserScheme = new Mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = Mongoose.model('User', UserScheme)
