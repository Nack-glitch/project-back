const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // for Socket.IO
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // <-- use http server

// --- Socket.IO setup ---
const io = new Server(server, {
  cors: {
    origin: "*", // allow your frontend IP
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("new-product", (product) => {
    // Broadcast new product to all clients
    io.emit("new-product", product);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log(err));

// --- Start server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
