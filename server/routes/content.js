const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

// GET /api/content — all sections (public, for rendering the site)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT section, data FROM portfolio_content ORDER BY section');
    const content = {};
    result.rows.forEach(({ section, data }) => { content[section] = data; });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/content/:section — single section
router.get('/:section', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT data FROM portfolio_content WHERE section = $1',
      [req.params.section]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Section not found' });
    res.json(result.rows[0].data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/content/:section — upsert (admin only)
router.put('/:section', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `INSERT INTO portfolio_content (section, data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (section) DO UPDATE
         SET data = EXCLUDED.data, updated_at = NOW()
       RETURNING section, data, updated_at`,
      [req.params.section, JSON.stringify(req.body)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
