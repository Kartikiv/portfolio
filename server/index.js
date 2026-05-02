require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const migrate = require('./migrate');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const metricsRoutes = require('./routes/metrics');

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/metrics', metricsRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Portfolio API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup migration failed:', err.message);
    process.exit(1);
  });
