const db = require('../config/db');

const getPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM custom_pages WHERE page_name = ?', [req.params.name]);
    if (rows.length === 0) return res.status(404).json({ message: 'Page not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePage = async (req, res) => {
  try {
    const { title, content } = req.body;
    await db.query(
      'UPDATE custom_pages SET title = ?, content = ? WHERE page_name = ?',
      [title, content, req.params.name]
    );
    res.json({ message: 'Page updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPage, updatePage };