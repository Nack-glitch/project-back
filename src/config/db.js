const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://Nack glitch:nack_123@myCluster.abcde.mongodb.net/user?retryWrites=true&w=majority";


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("❌ MongoDB Atlas connection error:", err);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err);
});

module.exports = connectDB;
