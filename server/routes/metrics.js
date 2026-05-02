const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

const TZ = 'America/Los_Angeles';

// ── Range helper ─────────────────────────────────────────────────────────────
function intervalFor(range) {
  return { '24h': '24 hours', '7d': '7 days', '30d': '30 days' }[range] || null;
}

// ── POST /api/metrics/event — public ────────────────────────────────────────
router.post('/event', async (req, res) => {
  try {
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
    const range    = ['24h', '7d', '30d', 'all'].includes(req.query.range) ? req.query.range : '7d';
    const interval = intervalFor(range);

    const where  = interval ? `WHERE created_at > NOW() - $1::interval` : `WHERE 1=1`;
    const params = interval ? [interval] : [];

    // 1. Totals per event type
    const totals = await db.query(
      `SELECT event_type, COUNT(*) AS count FROM site_events ${where} GROUP BY event_type`,
      params
    );

    // 2. Top keys per type
    const byKey = await db.query(
      `SELECT event_type, event_key, COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY event_type, event_key
       ORDER BY event_type, count DESC`,
      params
    );

    // 3. Daily breakdown — grouped by date in local timezone
    const daily = await db.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('day', created_at AT TIME ZONE '${TZ}'), 'YYYY-MM-DD') AS date,
         event_type,
         COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY 1, event_type
       ORDER BY 1 ASC`,
      params
    );

    // 4. 4-hour traffic buckets (0 = 12am–4am … 5 = 8pm–12am) in local timezone
    const buckets = await db.query(
      `SELECT
         FLOOR(EXTRACT(HOUR FROM (created_at AT TIME ZONE '${TZ}')) / 4)::int AS bucket,
         COUNT(*) AS count
       FROM site_events ${where}
       GROUP BY bucket
       ORDER BY bucket`,
      params
    );

    // 5. Hourly breakdown for 24h view in local timezone
    const hourly = await db.query(
      `SELECT
         EXTRACT(HOUR FROM (created_at AT TIME ZONE '${TZ}'))::int AS hour,
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
    await db.query('DELETE FROM site_events');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
