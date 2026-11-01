const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect } = require('../middleware/authMiddleware');
const { getHeroSlides, addHeroSlide, deleteHeroSlide } = require('../controllers/heroController');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'alnajwah_hero', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] },
});
const upload = multer({ storage });

router.get('/', getHeroSlides);
router.post('/', protect, upload.fields([{ name: 'desktop_image', maxCount: 1 }, { name: 'mobile_image', maxCount: 1 }]), addHeroSlide);
router.delete('/:id', protect, deleteHeroSlide);

module.exports = router;