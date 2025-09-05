import Product from '../models/productModel.js';  // ← go **up one folder** then into models

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: true, products });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: false, message: 'Product not found' });
    res.status(200).json({ status: true, product });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = new Product({ name, price, description });
    const savedProduct = await product.save();
    res.status(201).json({ status: true, product: savedProduct });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ status: false, message: 'Product not found' });
    res.status(200).json({ status: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ status: false, message: 'Product not found' });
    res.status(200).json({ status: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
