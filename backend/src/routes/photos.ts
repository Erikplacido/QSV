import { Router, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { upload } from '../config/multer';
import { AppError } from '../middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless (Vercel), use /tmp/uploads, otherwise use local uploads directory
const uploadsBaseDir = process.env.VERCEL === '1' 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../../uploads');

const router = Router();

// Upload photo
router.post('/upload', requireAuth, upload.single('file'), async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
    
    const { inspectionId, poiInstanceId, phaseNumber } = req.body;
    
    if (!inspectionId) {
      // Delete uploaded file if inspectionId is missing
      fs.unlinkSync(req.file.path);
      throw new AppError('inspectionId is required', 400);
    }
    
    // Construct relative URL
    const relativePath = path.relative(uploadsBaseDir, req.file.path);
    const photoUrl = `/api/photos/${relativePath.replace(/\\/g, '/')}`;
    
    res.json({
      photoUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    next(error);
  }
});

// Get photo (served as static file, but we can add auth here if needed)
router.get('/:filename(*)', (req: Request, res: Response, next) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsBaseDir, filename);
    
    // Security: prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    const uploadsDir = path.resolve(uploadsBaseDir);
    
    if (!resolvedPath.startsWith(uploadsDir)) {
      throw new AppError('Invalid file path', 403);
    }
    
    if (!fs.existsSync(filePath)) {
      throw new AppError('File not found', 404);
    }
    
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
});

export default router;


