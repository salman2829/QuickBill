const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Load env: server/.env is canonical (Render rootDir=server). Root .env is optional fallback.
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabase = require('./config/supabase.js');
const errorHandler = require('./middleware/errorHandler.js');

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const saleRoutes = require('./routes/saleRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');

const app = express();

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Dual Route Registrations (Supports Vercel serverless /api and direct endpoints)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/sales', saleRoutes);
app.use('/sales', saleRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Health Check Endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    system: 'QuickBill POS Serverless API',
    time: new Date().toISOString()
  });
});

// Static Files Serving for Local Dev / Standalone
// client/ is served first so local edits take priority over public/ build artifacts
const publicPath = path.join(__dirname, '..', 'public');
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
app.use(express.static(publicPath));

// API 404 Handler - ALWAYS return JSON instead of HTML for API paths
app.use(['/api/*', '/auth/*', '/products/*', '/sales/*', '/ai/*'], (req, res) => {
  res.status(404).json({ success: false, message: `API Route ${req.originalUrl} not found` });
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

// Standalone Server Listener for local dev
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  ⚡ QuickBill POS Server Running on Port ${PORT}`);
    console.log(`  🌐 Local: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
