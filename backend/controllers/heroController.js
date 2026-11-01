const db = require('../config/db');

const getHeroSlides = async (req, res) => {
  try {
    const [slides] = await db.query('SELECT * FROM hero_slides ORDER BY created_at DESC');
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addHeroSlide = async (req, res) => {
  try {
    if (!req.files || !req.files['desktop_image'] || !req.files['mobile_image']) {
      return res.status(400).json({ message: 'Please upload both desktop and mobile images.' });
    }

    // Cloudinary automatically returns the full URL in req.files[...][0].path
    const desktopPath = req.files['desktop_image'][0].path; 
    const mobilePath = req.files['mobile_image'][0].path;

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