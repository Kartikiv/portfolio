/**
 * migrate.js — Versioned DB migrations tracked in schema_migrations table.
 *
 * Each migration has an integer version and runs exactly once. Safe to call on
 * every server start. Add new migrations to the END of the MIGRATIONS array
 * only — never edit or reorder existing entries.
 *
 * Standalone usage : node server/migrate.js
 * Programmatic     : require('./migrate')()
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('./db');

const MIGRATIONS = [
  {
    version: 1,
    name: 'create_portfolio_content',
    async run(client) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS portfolio_content (
          section    VARCHAR(100) PRIMARY KEY,
          data       JSONB        NOT NULL,
          updated_at TIMESTAMPTZ  DEFAULT NOW()
        )
      `);
    },
  },

  {
    version: 2,
    name: 'create_site_events',
    async run(client) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS site_events (
          id         BIGSERIAL    PRIMARY KEY,
          event_type VARCHAR(50)  NOT NULL,
          event_key  VARCHAR(100) NOT NULL,
          created_at TIMESTAMPTZ  DEFAULT NOW()
        )
      `);
      await client.query(`
        CREATE INDEX IF NOT EXISTS site_events_created_idx
          ON site_events (created_at)
      `);
      await client.query(`
        CREATE INDEX IF NOT EXISTS site_events_type_key_idx
          ON site_events (event_type, event_key)
      `);
    },
  },

  {
    version: 3,
    name: 'hero_typewriter_marquee',
    async run(client) {
      const { rows } = await client.query(
        `SELECT data FROM portfolio_content WHERE section = 'hero'`
      );
      if (!rows.length) return; // hero row not seeded yet — skip

      const hero = rows[0].data;
      const patches = {};

      if (!hero.typewriterPhrases) {
        patches.typewriterPhrases = [
          'Building Scalable Systems & Intelligent Solutions',
          'Distributed Systems Engineer',
          'ML Infrastructure Architect',
          'Open to New Opportunities',
        ];
      }

      if (!hero.marquee) {
        patches.marquee = [
          { slug: 'openjdk',       name: 'Java' },
          { slug: 'python',        name: 'Python' },
          { slug: 'springboot',    name: 'Spring Boot' },
          { slug: 'typescript',    name: 'TypeScript' },
          { slug: 'postgresql',    name: 'PostgreSQL' },
          { slug: 'docker',        name: 'Docker' },
          { slug: 'kubernetes',    name: 'Kubernetes' },
          { slug: 'terraform',     name: 'Terraform' },
          { slug: 'mongodb',       name: 'MongoDB' },
          { slug: 'react',         name: 'React' },
          { slug: 'go',            name: 'Go' },
          { slug: 'rust',          name: 'Rust' },
          { slug: 'pytorch',       name: 'PyTorch' },
          { slug: 'githubactions', name: 'CI/CD' },
          { slug: 'apachekafka',   name: 'Kafka' },
          { slug: 'grafana',       name: 'Grafana' },
          { slug: 'elasticsearch', name: 'Elasticsearch' },
          { slug: 'nginx',         name: 'Nginx' },
          { slug: 'postman',       name: 'Postman' },
        ];
      }

      if (Object.keys(patches).length === 0) return;

      await client.query(
        `UPDATE portfolio_content
           SET data = data || $1::jsonb, updated_at = NOW()
           WHERE section = 'hero'`,
        [JSON.stringify(patches)]
      );
    },
  },

  // ── Add future migrations here (increment version) ────────────────────────
];

async function migrate() {
  const client = await db.connect();
  try {
    // Ensure tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version    INT          PRIMARY KEY,
        name       TEXT         NOT NULL,
        applied_at TIMESTAMPTZ  DEFAULT NOW()
      )
    `);

    const { rows } = await client.query('SELECT version FROM schema_migrations');
    const applied = new Set(rows.map((r) => r.version));

    let count = 0;
    for (const m of MIGRATIONS) {
      if (applied.has(m.version)) continue;
      console.log(`  Applying v${m.version}: ${m.name}`);
      await m.run(client);
      await client.query(
        'INSERT INTO schema_migrations (version, name) VALUES ($1, $2)',
        [m.version, m.name]
      );
      count++;
    }

    if (count === 0) {
      console.log('  No pending migrations.');
    } else {
      console.log(`  ${count} migration(s) applied.`);
    }
  } finally {
    client.release();
  }
}

// Allow standalone execution: node server/migrate.js
if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => { console.error('Migration failed:', err.message); process.exit(1); });
}

module.exports = migrate;
