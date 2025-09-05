import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/projectDB';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
