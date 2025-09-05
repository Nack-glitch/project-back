import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// --- Register ---
router.post("/register", async (req, res) => {
  const { name, phoneNumber, password, role, farmName, location } = req.body;
  if (!name || !phoneNumber || !password || !role)
    return res.status(400).json({ status: false, message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser)
      return res.status(400).json({ status: false, message: "Phone number already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      phoneNumber,
      password: hashedPassword,
      role,
      farmName: role === "farmer" ? farmName : undefined,
      location: role === "farmer" ? location : undefined,
    });

    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ status: true, message: "Registered successfully", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

// --- Login ---
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password)
    return res.status(400).json({ status: false, message: "Phone & password required" });

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user)
      return res.status(400).json({ status: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ status: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ status: true, message: "Login successful", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

export default router;
