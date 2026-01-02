import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In serverless (Vercel), use /tmp/uploads, otherwise use local uploads directory
const uploadsDir = process.env.VERCEL === '1' 
  ? '/tmp/uploads' 
  : path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const inspectionId = req.body.inspectionId || 'temp';
    const inspectionDir = path.join(uploadsDir, 'inspections', inspectionId);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(inspectionDir)) {
      fs.mkdirSync(inspectionDir, { recursive: true });
    }
    
    cb(null, inspectionDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    const filename = `photo_${timestamp}_${randomStr}${ext}`;
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.'));
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

export default upload;


