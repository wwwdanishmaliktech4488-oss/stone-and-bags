const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPage, updatePage } = require('../controllers/pageController');

router.get('/:name', getPage);
router.put('/:name', protect, updatePage);

module.exports = router;