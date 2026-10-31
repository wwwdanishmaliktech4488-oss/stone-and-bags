const db = require('../config/db');

// Get approved reviews (Public)
const getApprovedReviews = async (req, res) => {
  try {
    const [reviews] = await db.query('SELECT * FROM reviews WHERE is_approved = 1 ORDER BY created_at DESC');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reviews (Admin)
const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a review (Public)
const addReview = async (req, res) => {
  try {
    const { customer_name, rating, comment } = req.body;
    await db.query(
      'INSERT INTO reviews (customer_name, rating, comment, is_approved) VALUES (?, ?, ?, 0)',
      [customer_name, rating, comment]
    );
    res.status(201).json({ message: 'Review submitted for approval' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle review approval (Admin)
const toggleApproval = async (req, res) => {
  try {
    const { is_approved } = req.body;
    await db.query('UPDATE reviews SET is_approved = ? WHERE id = ?', [is_approved, req.params.id]);
    res.json({ message: 'Review status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete review (Admin)
const deleteReview = async (req, res) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getApprovedReviews, getAllReviews, addReview, toggleApproval, deleteReview };