const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `asset-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.get('/', getSettings);

// Accepts logo, hero_desktop, and hero_mobile files
router.put(
  '/', 
  protect, 
  upload.fields([
    { name: 'site_logo', maxCount: 1 },
    { name: 'hero_desktop', maxCount: 1 }, 
    { name: 'hero_mobile', maxCount: 1 }
  ]), 
  updateSettings
);

module.exports = router;