const Mongoose = require('mongoose')

const CartScheme = new Mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: Array, required: true },
      },
      {
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true },
)

module.exports = Mongoose.model('Cart', CartScheme)
