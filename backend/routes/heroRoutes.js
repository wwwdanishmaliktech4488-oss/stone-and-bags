const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { getHeroSlides, addHeroSlide, deleteHeroSlide } = require('../controllers/heroController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `hero-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Public route to get slides
router.get('/', getHeroSlides);

// Admin routes
router.post(
  '/', 
  protect, 
  upload.fields([{ name: 'desktop_image', maxCount: 1 }, { name: 'mobile_image', maxCount: 1 }]), 
  addHeroSlide
);
router.delete('/:id', protect, deleteHeroSlide);

module.exports = router;