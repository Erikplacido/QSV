import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Set session
    (req.session as any).userId = user.id;
    (req.session as any).userEmail = user.email;
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await User.findByPk(req.userId!);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  req.session?.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;

