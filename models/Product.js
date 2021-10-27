const Mongoose = require('mongoose')

const ProductScheme = new Mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true },
)

module.exports = Mongoose.model('Product', ProductScheme)
