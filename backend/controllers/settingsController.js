const db = require('../config/db');

const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    if (req.files && req.files['site_logo']) {
      const logoPath = `/uploads/${req.files['site_logo'][0].filename}`;
      await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = "site_logo"', [logoPath]);
    }

    const textSettings = [
      'contact_email', 'contact_phone', 'contact_address', 
      'social_facebook', 'social_instagram', 'social_twitter', 'social_tiktok',
      'whatsapp_number',
      'marquee_text', 'marquee_color' // <-- ADDED HERE
    ];
    
    for (const key of textSettings) {
      if (req.body[key] !== undefined) {
        const [existing] = await db.query('SELECT * FROM settings WHERE setting_key = ?', [key]);
        if (existing.length > 0) {
          await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [req.body[key], key]);
        } else {
          await db.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, req.body[key]]);
        }
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSettings, updateSettings };