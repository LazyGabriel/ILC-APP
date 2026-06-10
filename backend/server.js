require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/books',   require('./src/routes/books'));
app.use('/api/orders',  require('./src/routes/orders'));
app.use('/api/contact', require('./src/routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ILC Books API',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Database + Start ──────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ilc-books');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB not available — running in API-only mode (orders will not persist)');
    console.warn('   Install MongoDB or use MongoDB Atlas to enable persistence.');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 ILC Books API running at http://localhost:${PORT}`);
    console.log(`📚 Books endpoint:    http://localhost:${PORT}/api/books`);
    console.log(`📦 Orders endpoint:   http://localhost:${PORT}/api/orders`);
    console.log(`✉️  Contact endpoint:  http://localhost:${PORT}/api/contact`);
    console.log(`💚 Health check:      http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
