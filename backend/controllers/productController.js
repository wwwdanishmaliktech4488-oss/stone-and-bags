const db = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount_price, category, stock } = req.body;
    // Cloudinary returns the full URL in req.file.path
    const image_url = req.file ? req.file.path : null;

    await db.query(
      'INSERT INTO products (name, description, price, discount_price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, discount_price || null, category, stock, image_url]
    );

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discount_price, category, stock, is_active } = req.body;
    const productId = req.params.id;

    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (existing.length === 0) return res.status(404).json({ message: 'Product not found' });

    let image_url = existing[0].image_url;
    if (req.file) image_url = req.file.path; // Cloudinary returns the full URL here

    await db.query(
      'UPDATE products SET name=?, description=?, price=?, discount_price=?, category=?, stock=?, image_url=?, is_active=? WHERE id=?',
      [name, description, price, discount_price || null, category, stock, image_url, is_active, productId]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };