import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error handler triggered:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    path: req.path,
    method: req.method
  });
  
  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || 'Internal server error';
  
  // Don't send stack in production
  const response: any = { error: message };
  
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL === '1') {
    response.stack = err.stack;
    response.name = err.name;
  }
  
  res.status(status).json(response);
};


