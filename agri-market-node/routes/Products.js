const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");

const router = express.Router();

// Middleware to check auth
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, "sage", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// CREATE product
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const product = new Product({
      name,
      description,
      price,
      quantity,
      farmerId: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("farmerId", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmerId", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
