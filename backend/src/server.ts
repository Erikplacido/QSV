import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'qualiseg',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Session store
const MySQLSession = MySQLStore(session);

// Middleware
// In Vercel, allow requests from the same origin
const corsOrigin = process.env.VERCEL === '1' 
  ? process.env.FRONTEND_URL || '*' 
  : process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  store: new MySQLSession({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'qualiseg',
  }),
  secret: process.env.SESSION_SECRET || 'qualiseg-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}));

// Serve uploaded images
// In serverless, use /tmp/uploads, otherwise use local uploads directory
const uploadsPath = process.env.VERCEL === '1' 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../uploads');
app.use('/api/photos', express.static(uploadsPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import routes
import authRoutes from './routes/auth.js';
import inspectionRoutes from './routes/inspections.js';
import poiInstanceRoutes from './routes/poi-instances.js';
import photoRoutes from './routes/photos.js';
import delegatedRoutes from './routes/delegated.js';

// Import models to initialize associations
import sequelize from './config/database.js';
import './models/index.js';

// Test database connection (non-blocking in serverless)
// Don't fail if DB is not available at startup - will fail on first query
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch((err: Error) => {
    console.error('⚠️ Unable to connect to the database at startup:', err.message);
    console.error('DB Config check:', {
      host: process.env.DB_HOST || 'NOT SET',
      port: process.env.DB_PORT || 'NOT SET',
      database: process.env.DB_NAME || 'NOT SET',
      user: process.env.DB_USER || 'NOT SET',
      hasPassword: !!process.env.DB_PASSWORD
    });
    // Don't throw - let it fail on first query instead
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/poi-instances', poiInstanceRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/delegated', delegatedRoutes);

// Error handling middleware
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);

// Start server only if not in serverless environment
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;

