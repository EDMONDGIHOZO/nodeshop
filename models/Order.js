const Mongoose = require('mongoose')

const OrderScheme = new Mongoose.Schema(
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
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true },
)

module.exports = Mongoose.model('Order', OrderScheme)
