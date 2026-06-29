import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware
router.use(protect);

router.post('/bio', aiController.generateBio);

export default router;
