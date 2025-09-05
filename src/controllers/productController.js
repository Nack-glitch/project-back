import Product from '../models/productModel.js';

// --- Get all products ---
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ status: true, products });
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ status: false, message: 'Server error', error: err.message });
  }
};

// --- Get single product by ID ---
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ status: false, message: 'Product not found' });

    res.status(200).json({ status: true, product });
  } catch (err) {
    console.error('Get Product Error:', err);
    res.status(500).json({ status: false, message: 'Server error', error: err.message });
  }
};

// --- Create new product ---
export const createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ status: false, message: 'Name and price are required' });
  }

  try {
    const product = new Product({ name, price, description });
    const savedProduct = await product.save();
    res.status(201).json({ status: true, message: 'Product created', product: savedProduct });
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ status: false, message: 'Server error', error: err.message });
  }
};

// --- Update product ---
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ status: false, message: 'Product not found' });

    res.status(200).json({ status: true, message: 'Product updated', product: updatedProduct });
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ status: false, message: 'Server error', error: err.message });
  }
};

// --- Delete product ---
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct)
      return res.status(404).json({ status: false, message: 'Product not found' });

    res.status(200).json({ status: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Delete Product Error:', err);
    res.status(500).json({ status: false, message: 'Server error', error: err.message });
  }
};
