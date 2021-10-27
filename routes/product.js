const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyToken,
  adminVerification,
  customerVerification,
} = require("../middleware/tokenVerifier");

// create the Product
router.post("/", adminVerification, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "success",
      data: savedProduct,
    });
  } catch (e) {
    res.status(401).send({
      message: "an error occured" + e.response.toString(),
    });
  }
});

// preview the products
router.get("/", async (request, response) => {
  // try to return by categories or new
  const qNew = request.query.new;
  const qCategory = request.query.category;

  try {
    let results;
    if (qNew) {
      results = await Product.find().sort({ createdAt: -1 }).limit(4);
    } else if (qCategory) {
      results = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      results = await Product.find().sort({ _id: -1 }).limit(2);
    }

    return response.status(200).json(results);
  } catch (e) {
    res.json(e);
  }
});

// preview single product
router.get("/:id", async (req, res) => {
  try {
    const results = await Product.findById(req.params.id);
    res.status(200).json(results);
  } catch (e) {
    res.status(500).json({ message: "something did not go well", error: e });
  }
});

// update the Product
router.put("/update/:id", adminVerification, async (request, response) => {
  try {
    const results = await Product.findByIdAndUpdate(
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
    await Product.findByIdAndRemove(request.params.id);
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
