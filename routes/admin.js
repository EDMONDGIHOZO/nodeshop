const { adminVerification } = require("../middleware/tokenVerifier");
const User = require("../models/User");

const Router = require("express").Router();

// get all users
Router.get("/users/all", adminVerification, async (request, response) => {
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
Router.get("/stats", adminVerification, async (req, res) => {
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

module.exports = Router;
