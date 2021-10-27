const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  adminVerification,
  customerVerification,
} = require("../middleware/tokenVerifier");

// create the cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(201).json({
      message: "success",
      data: savedCart,
    });
  } catch (e) {
    res.status(401).send({
      message: "an error occured" + e,
    });
  }
});

// update the user cart

router.put("/:id", verifyToken, async (request, response) => {
  try {
    const res = await Cart.findByIdAndUpdate(
      request.params.id,
      {
        $set: request.body,
      },
      { new: true }
    );

    return response.json(res);
  } catch (e) {
    return res.status(500).json({
      message: "someting went bad",
    });
  }
});

router.get("/:userid", customerVerification, async (request, response) => {
  let results;
  try {
    result = await Cart.findOne({ userId: request.params.userid });
    return response.json(result);
  } catch (e) {
    return response.status(500).json({
      message: "an error occured",
      error: e.toStrong(),
    });
  }
});

module.exports = router;
