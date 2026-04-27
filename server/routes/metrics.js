const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

// ── Schema ───────────────────────────────────────────────────────────────────
async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS site_events (
      id         BIGSERIAL    PRIMARY KEY,
      event_type VARCHAR(50)  NOT NULL,
      event_key  VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
  await db.query(`
    CREATE INDEX IF NOT EXISTS site_events_created_idx ON site_events (created_at);
  `);
  await db.query(`
    CREATE INDEX IF NOT EXISTS site_events_type_key_idx ON site_events (event_type, event_key);
  `);
}

// ── Range helper ─────────────────────────────────────────────────────────────
function intervalFor(range) {
  return { '24h': '24 hours', '7d': '7 days', '30d': '30 days' }[range] || null;
}

// ── POST /api/metrics/event — public ────────────────────────────────────────
router.post('/event', async (req, res) => {
  try {
    await ensureTable();
    const { type, key } = req.body;
    if (!type || !key) return res.status(400).json({ error: 'type and key required' });
    await db.query(
      'INSERT INTO site_events (event_type, event_key) VALUES ($1, $2)',
      [type, key]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/metrics?range=24h|7d|30d|all — protected ───────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    await ensureTable();

    const range    = ['24h', '7d', '30d', 'all'].includes(req.query.range) ? req.query.range : '7d';
    const interval = intervalFor(range);

    // WHERE clause — parameterised via $1
    const where = interval
      ? `WHERE created_at > NOW() - $1::interval`
      : `WHERE 1=1`;
    const params = interval ? [interval] : [];

    // 1. Totals per event type
    const totals = await db.query(
      `SELECT event_type, COUNT(*) AS count FROM site_events ${where} GROUP BY event_type`,
      params
    );

    // 2. Top keys per type (max 20 per type)
    const byKey = await db.query(
      `SELECT event_type, event_key, COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY event_type, event_key
       ORDER BY event_type, count DESC`,
      params
    );

    // 3. Daily breakdown — group by UTC date + event_type
    const daily = await db.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
         event_type,
         COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY date, event_type
       ORDER BY date ASC`,
      params
    );

    // 4. 4-hour traffic buckets (0 = 12am-4am … 5 = 8pm-12am), all types combined
    const buckets = await db.query(
      `SELECT
         FLOOR(EXTRACT(HOUR FROM created_at) / 4)::int AS bucket,
         COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY bucket
       ORDER BY bucket`,
      params
    );

    // 5. Hourly breakdown for 24h view
    const hourly = await db.query(
      `SELECT
         EXTRACT(HOUR FROM created_at)::int AS hour,
         event_type,
         COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY hour, event_type
       ORDER BY hour`,
      params
    );

    res.json({
      range,
      totals:  totals.rows,
      byKey:   byKey.rows,
      daily:   daily.rows,
      buckets: buckets.rows,
      hourly:  hourly.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/metrics/reset — protected ───────────────────────────────────
router.delete('/reset', requireAuth, async (req, res) => {
  try {
    await ensureTable();
    await db.query('DELETE FROM site_events');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
