const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product"); // Make sure filename matches

const router = express.Router();

// --- Middleware to check auth ---
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// --- CREATE product ---
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, price, quantity, category, unit, location } = req.body;

    const product = new Product({
      name,
      description,
      price,
      quantity,
      category,
      unit,
      location,
      farmerId: req.user._id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- GET all products ---
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("farmerId", "name phoneNumber farmName location");
    res.json({ status: true, products });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

// --- GET product by ID ---
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmerId", "name phoneNumber farmName location");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ status: true, product });
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
