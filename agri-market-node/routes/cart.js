const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/product");

// --- Add to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role === "farmer" && product.farmerId.toString() === req.user.id) {
      return res.status(403).json({ message: "Farmers cannot buy their own product" });
    }

    res.json({ message: "Added to cart", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
