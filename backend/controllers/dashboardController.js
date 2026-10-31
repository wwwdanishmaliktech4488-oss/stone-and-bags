const db = require('../config/db');

const getStats = async (req, res) => {
  try {
    // 1. Get total products
    const [products] = await db.query('SELECT COUNT(*) as count FROM products');
    
    // 2. Get total orders
    const [orders] = await db.query('SELECT COUNT(*) as count FROM orders');
    
    // 3. Get total revenue (sum of all total_amounts)
    const [revenue] = await db.query('SELECT SUM(total_amount) as total FROM orders');

    res.json({
      totalProducts: products[0].count,
      totalOrders: orders[0].count,
      totalRevenue: revenue[0].total || 0 // If no orders, return 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats };