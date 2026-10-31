const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- Routes ----------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/hero', require('./routes/heroRoutes')); 
app.use('/api/pages', require('./routes/pageRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes')); 

// ---------- Health check ----------
app.get('/', (req, res) => {
  res.json({ message: 'Stone & Bags API is running 🚀' });
});

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});