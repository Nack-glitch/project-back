const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const User = require("../models/User");

// --- Add to cart / Transfer product ---
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    // --- Check if product exists ---
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // --- Prevent farmer from buying their own product ---
    if (req.user.role === "farmer" && product.farmerId.toString() === req.user._id) {
      return res.status(403).json({ message: "Farmers cannot buy their own product" });
    }

    // --- Find client (buyer) in DB ---
    const client = await User.findById(req.user._id);
    if (!client) return res.status(404).json({ message: "User not found" });

    // --- Add product to client's cart ---
    client.cart = client.cart || [];
    if (!client.cart.includes(product._id)) {
      client.cart.push(product._id);
    }

    await client.save();

    res.status(200).json({
      message: "Product added to your cart successfully",
      product,
      cart: client.cart,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
