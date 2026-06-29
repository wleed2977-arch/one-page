import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all upload routes
router.use(protect);

router.post('/image', upload.single('image'), uploadController.uploadImage);

export default router;
