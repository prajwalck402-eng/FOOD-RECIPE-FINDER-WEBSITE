const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
// Load environment variables from cwd or server directory
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const recipeRoutes = require('./routes/recipeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const groceryRoutes = require('./routes/groceryRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const authRoutes = require('./routes/authRoutes');
const { seedRecipesIfEmpty } = require('./controllers/recipeController');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipe_finder';

// Sanitize MongoDB URI so passwords are never exposed in server logs
const sanitizedMongoUri = MONGODB_URI.includes('@')
  ? MONGODB_URI.replace(/:([^:@]+)@/, ':****@')
  : MONGODB_URI;

// CORS configuration (supports both single-domain deployment and cross-origin frontend)
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
    aiConfigured: Boolean(process.env.GROQ_API_KEY),
    aiModel: process.env.GROQ_MODEL || 'qwen/qwen3.6-27b'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/meal-plans', mealPlanRoutes);

// Serve static client assets in production (or whenever client/dist exists)
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving static client build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Catch-all route to serve React's index.html for SPA client-side routing
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  console.log(`🍃 Connected to MongoDB at ${sanitizedMongoUri}`);
  await seedRecipesIfEmpty();
  app.listen(PORT, () => {
    console.log(`🚀 Master Chef Recipe Backend running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error(`⚠️ MongoDB Connection Error: ${err.message}`);
  console.log(`Running in fallback in-memory mode if needed... Starting server anyway on port ${PORT}`);
  app.listen(PORT, () => {
    console.log(`🚀 Master Chef Recipe Backend running (No Mongo) on port ${PORT}`);
  });
});
