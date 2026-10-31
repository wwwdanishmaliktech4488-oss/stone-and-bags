const db = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, total_amount, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Generate a unique tracking ID (e.g., ALN-58493)
    const trackingId = `ALN-${Math.floor(10000 + Math.random() * 90000)}`;

    // 1. Insert into orders table
    const [orderResult] = await db.query(
      `INSERT INTO orders 
      (tracking_id, customer_name, customer_email, customer_phone, customer_address, total_amount, status) 
      VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [trackingId, customer_name, customer_email, customer_phone, customer_address, total_amount]
    );

    const orderId = orderResult.insertId;

    // 2. Insert into order_items table
    const orderItemsData = items.map(item => [
      orderId,
      item.id,
      item.name,
      item.quantity,
      item.price
    ]);

    await db.query(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ?`,
      [orderItemsData]
    );

    // Send back the tracking ID to the frontend
    res.status(201).json({ message: 'Order placed successfully', orderId, trackingId });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Track an order by Tracking ID
// @route   GET /api/orders/track/:trackingId
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE tracking_id = ?', [req.params.trackingId]);
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found. Please check your Tracking ID.' });
    }

    // Get order items too
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orders[0].id]);
    
    res.json({ order: orders[0], items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders (Admin only)
const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, trackOrder };