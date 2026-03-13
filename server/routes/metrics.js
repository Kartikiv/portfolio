const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

// Ensure table exists on first use
async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_metrics (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      event_key  VARCHAR(100) NOT NULL,
      count      INTEGER DEFAULT 1,
      last_seen  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (event_type, event_key)
    )
  `);
}

// POST /api/metrics/event — public, called by the site
router.post('/event', async (req, res) => {
  try {
    await ensureTable();
    const { type, key } = req.body;
    if (!type || !key) return res.status(400).json({ error: 'type and key required' });
    await db.query(
      `INSERT INTO site_metrics (event_type, event_key, count, last_seen)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (event_type, event_key)
       DO UPDATE SET count = site_metrics.count + 1, last_seen = NOW()`,
      [type, key]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/metrics — protected, returns all metrics
router.get('/', requireAuth, async (req, res) => {
  try {
    await ensureTable();
    const result = await db.query(
      'SELECT event_type, event_key, count, last_seen FROM site_metrics ORDER BY event_type, count DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/metrics/reset — protected, wipes all metrics
router.delete('/reset', requireAuth, async (req, res) => {
  try {
    await ensureTable();
    await db.query('DELETE FROM site_metrics');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
