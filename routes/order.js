const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  adminVerification,
  customerVerification,
} = require("../middleware/tokenVerifier");

// create the Product
router.post("/", adminVerification, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "success",
      data: savedOrder,
    });
  } catch (e) {
    res.status(401).send({
      message: "an error occured" + e,
    });
  }
});

// preview single order
router.get("/:id", async (req, res) => {
  try {
    const results = await Product.findById(req.params.id);
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "something did not go well", error: e });
  }
});

// update the order
router.put("/update/:id", adminVerification, async (request, response) => {
  try {
    const results = await Order.findByIdAndUpdate(
      request.params.id,
      {
        $set: request.body,
      },
      // tell the mongodb to return new version of the product
      { new: true }
    );
    return response.status(201).json({
      message: "success",
      data: results,
    });
  } catch (e) {
    response.status(500).status({
      message: "something really went wrong",
    });
  }
});

// delete the product
router.delete("/destroy/:id", adminVerification, async (request, response) => {
  try {
    await Order.findByIdAndRemove(request.params.id);
    return response.json({
      message: "successful deletion",
    });
  } catch (e) {
    res.json({
      message: "someting went wrong",
    });
  }
});

module.exports = router;
