const db = require('../config/db');

// Get all hero slides
const getHeroSlides = async (req, res) => {
  try {
    const [slides] = await db.query('SELECT * FROM hero_slides ORDER BY created_at DESC');
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new hero slide
const addHeroSlide = async (req, res) => {
  try {
    // Check if files were uploaded by multer
    if (!req.files || !req.files['desktop_image'] || !req.files['mobile_image']) {
      return res.status(400).json({ message: 'Please upload both desktop and mobile images.' });
    }

    // Get the exact URL path from multer
    const desktopPath = `/uploads/${req.files['desktop_image'][0].filename}`;
    const mobilePath = `/uploads/${req.files['mobile_image'][0].filename}`;

    await db.query(
      'INSERT INTO hero_slides (desktop_image, mobile_image) VALUES (?, ?)',
      [desktopPath, mobilePath]
    );

    res.status(201).json({ message: 'Hero slide added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a hero slide
const deleteHeroSlide = async (req, res) => {
  try {
    await db.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id]);
    res.json({ message: 'Hero slide deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getHeroSlides, addHeroSlide, deleteHeroSlide };