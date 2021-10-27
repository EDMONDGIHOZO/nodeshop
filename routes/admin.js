const { adminVerification } = require("../middleware/tokenVerifier");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const router = require("express").Router();

// get all users
router.get("/users/all", adminVerification, async (request, response) => {
  const users = await User.find();

  if (users) {
    return response.json(users);
  } else {
    return response.json({
      message: "an error occured",
    });
  }
});

// get the users stats
router.get("/stats", adminVerification, async (req, res) => {
  // return the monthly users
  const date = new Date();
  const last_year = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const results = await User.aggregate([
      { $match: { createdAt: { $gte: last_year } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(results);
  } catch (e) {
    res.status(500).json(e);
  }
});

// view the carts
router.get("/carts", adminVerification, async (request, response) => {
  let results;
  try {
    results = await Cart.find().sort({ createdAt: -1 }).limit(20);
    return response.status(200).json(results);
  } catch (e) {
    return response.status(500).json({
      message: "an error occured",
      error: e.toStrong(),
    });
  }
});

// preview orders
router.get("/orders", async (request, response) => {
  // try to return by categories or new
  const qNew = request.query.new;
  const qCategory = request.query.category;

  try {
    let results;
    if (qNew) {
      results = await Order.find().sort({ createdAt: -1 }).limit(4);
    } else if (qCategory) {
      results = await Order.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      results = await Order.find().sort({ _id: -1 }).limit(2);
    }

    return response.status(200).json(results);
  } catch (e) {
    res.json(e);
  }
});

// preview the income

router.get("/income", async (request, response) => {
  const date = new Date();
  const last_month = new Date(setMonth(date.getMonth() - 1));
  const prev_month = new date(new Date().setMonth(last_month.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: prev_month } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    return response.status(200).json(income);
  } catch (e) {
    return response.status(500).json(e);
  }
});

module.exports = router;
