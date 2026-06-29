import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import cloudinary from '../config/cloudinary.js';
import { sendResponse } from '../utils/response.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const hasCloudinary = () =>
  process.env.CLOUDINARY_NAME &&
  process.env.CLOUDINARY_KEY &&
  process.env.CLOUDINARY_SECRET &&
  process.env.CLOUDINARY_NAME !== 'mock-cloud';

const ensureUploadsDir = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
};

const saveLocal = (file) => {
  ensureUploadsDir();
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/${filename}`;
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (hasCloudinary()) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        folder: 'onepage',
      });
      return sendResponse(res, 200, true, 'Image uploaded successfully', { url: result.secure_url });
    }

    const url = saveLocal(req.file);
    sendResponse(res, 200, true, 'Image uploaded successfully', { url });
  } catch (error) {
    next(error);
  }
};
