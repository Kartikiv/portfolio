const router = require('express').Router();
const db = require('../db');
const requireAuth = require('../middleware/auth');

// ── Section schemas ────────────────────────────────────────────────────────────
// Each entry defines: validate(data) → string|null (error msg), and template.
const SCHEMAS = {
  experience: {
    template: {
      items: [
        {
          title: 'Job Title',
          company: 'Company Name',
          period: 'Start – End',
          location: 'City, Country',
          achievements: ['Bullet point describing what you did.'],
        },
      ],
    },
    validate(data) {
      if (!data || typeof data !== 'object' || Array.isArray(data))
        return 'Must be an object with an "items" array, not a plain array.';
      if (!Array.isArray(data.items))
        return 'Missing required key "items" (must be an array of job objects).';
      for (let i = 0; i < data.items.length; i++) {
        const it = data.items[i];
        if (typeof it !== 'object' || Array.isArray(it))
          return `items[${i}] must be an object.`;
        for (const key of ['title', 'company', 'period', 'achievements']) {
          if (!(key in it))
            return `items[${i}] is missing required key "${key}". Use "title" (not "role") and "achievements" (not "updates").`;
        }
        if (!Array.isArray(it.achievements))
          return `items[${i}].achievements must be an array of strings.`;
      }
      return null;
    },
  },

  skills: {
    template: {
      categories: [
        {
          icon: 'Code2',
          title: 'Category Name',
          skills: ['Skill A', 'Skill B'],
        },
      ],
    },
    validate(data) {
      if (!data || typeof data !== 'object' || Array.isArray(data))
        return 'Must be an object with a "categories" array.';
      if (!Array.isArray(data.categories))
        return 'Missing required key "categories" (must be an array).';
      for (let i = 0; i < data.categories.length; i++) {
        const c = data.categories[i];
        for (const key of ['icon', 'title', 'skills']) {
          if (!(key in c))
            return `categories[${i}] is missing required key "${key}".`;
        }
        if (!Array.isArray(c.skills))
          return `categories[${i}].skills must be an array of strings.`;
      }
      return null;
    },
  },

  projects: {
    template: {
      items: [
        {
          icon: 'Brain',
          title: 'Project Title',
          tech: 'Tech stack',
          description: 'One-line description',
          highlights: ['What you built or achieved.'],
        },
      ],
    },
    validate(data) {
      if (!data || typeof data !== 'object' || Array.isArray(data))
        return 'Must be an object with an "items" array.';
      if (!Array.isArray(data.items))
        return 'Missing required key "items" (must be an array of project objects).';
      for (let i = 0; i < data.items.length; i++) {
        const it = data.items[i];
        for (const key of ['title', 'highlights']) {
          if (!(key in it))
            return `items[${i}] is missing required key "${key}".`;
        }
        if (!Array.isArray(it.highlights))
          return `items[${i}].highlights must be an array of strings.`;
      }
      return null;
    },
  },

  certifications: {
    template: {
      items: [{ icon: 'Award', text: 'Certification name or achievement.' }],
    },
    validate(data) {
      if (!data || typeof data !== 'object' || Array.isArray(data))
        return 'Must be an object with an "items" array.';
      if (!Array.isArray(data.items))
        return 'Missing required key "items" (must be an array).';
      for (let i = 0; i < data.items.length; i++) {
        if (!('text' in data.items[i]))
          return `items[${i}] is missing required key "text".`;
      }
      return null;
    },
  },
};

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

// GET /api/content/:section/schema — returns the expected structure for a section
router.get('/:section/schema', async (req, res) => {
  const schema = SCHEMAS[req.params.section];
  if (!schema) return res.status(404).json({ error: 'No schema defined for this section.' });
  res.json({ section: req.params.section, expected_structure: schema.template });
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
    const schema = SCHEMAS[req.params.section];
    if (schema) {
      const err = schema.validate(req.body);
      if (err) {
        return res.status(400).json({
          error: `Invalid structure for "${req.params.section}": ${err}`,
          expected_structure: schema.template,
        });
      }
    }

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
