// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// --- App Setup ---
const app = express();
const server = http.createServer(app);

// --- Middleware ---
app.use(cors()); // allow all origins, you can restrict in production
app.use(express.json());

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: "*", // allow your frontend URL, e.g., https://your-app.onrender.com
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("new-product", (product) => {
    // broadcast new product to all connected clients
    io.emit("new-product", product);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// --- Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // stop server if DB fails
  });

// --- Start Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

