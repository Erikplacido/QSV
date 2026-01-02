// Set Vercel environment flag before importing app
process.env.VERCEL = '1';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../backend/src/server';

// Export handler for Vercel serverless functions
export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // Forward request to Express app
  return app(req as any, res as any);
}
