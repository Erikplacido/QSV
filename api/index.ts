// Set Vercel environment flag before importing app
process.env.VERCEL = '1';

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lazy load the app to catch initialization errors
let app: any = null;
let appError: Error | null = null;

async function getApp() {
  if (app) return app;
  if (appError) throw appError;
  
  try {
    console.log('Initializing Express app...');
    const appModule = await import('../backend/src/server');
    app = appModule.default;
    console.log('Express app initialized successfully');
    return app;
  } catch (error: any) {
    console.error('Failed to initialize Express app:', error);
    appError = error;
    throw error;
  }
}

// Export handler for Vercel serverless functions
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    const origin = process.env.FRONTEND_URL || req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Get or initialize the Express app
    const expressApp = await getApp();
    
    // Forward request to Express app
    return expressApp(req as any, res as any);
  } catch (error: any) {
    console.error('Error in API handler:', error);
    console.error('Error stack:', error?.stack);
    console.error('Environment check:', {
      VERCEL: process.env.VERCEL,
      DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
      DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT SET',
      DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
    });
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
    });
  }
}
