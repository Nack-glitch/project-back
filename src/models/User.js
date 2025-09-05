import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  farmName: { type: String },
  location: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
