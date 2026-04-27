/**
 * migrate.js — Safe, additive DB migrations. Never overwrites existing content.
 *
 * Each migration checks whether the change is already applied before touching
 * anything. Safe to run on every deploy.
 *
 * Usage: cd server && node migrate.js
 *   (or from root: npm run migrate)
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('./db');

// ── Migration definitions ────────────────────────────────────────────────────
// Each entry: { id, description, run(client) }
// run() must be idempotent — check before applying.

const migrations = [
  {
    id: 'hero_typewriter_marquee',
    description: 'Add typewriterPhrases and marquee to hero section',
    async run(client) {
      // Read current hero data
      const { rows } = await client.query(
        `SELECT data FROM portfolio_content WHERE section = 'hero'`
      );
      if (!rows.length) {
        console.log('  ⚠  hero row not found — skipping');
        return;
      }

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

      if (Object.keys(patches).length === 0) {
        console.log('  ✓ already up to date');
        return;
      }

      // Merge patches into existing data — existing keys are never touched
      await client.query(
        `UPDATE portfolio_content
         SET data = data || $1::jsonb, updated_at = NOW()
         WHERE section = 'hero'`,
        [JSON.stringify(patches)]
      );
      console.log(`  ✓ patched: ${Object.keys(patches).join(', ')}`);
    },
  },

  // ── Add future migrations here ────────────────────────────────────────────
  // {
  //   id: 'my_next_migration',
  //   description: '...',
  //   async run(client) { ... },
  // },
];

// ── Runner ───────────────────────────────────────────────────────────────────
async function migrate() {
  const client = await db.connect();
  try {
    console.log(`\nRunning ${migrations.length} migration(s)…\n`);
    for (const m of migrations) {
      console.log(`▸ [${m.id}] ${m.description}`);
      await m.run(client);
    }
    console.log('\n✓ All migrations complete.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

migrate();
