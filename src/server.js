import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { PORT, MONGO_URI } from './config.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => res.send('✅ Backend is running!'));

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
