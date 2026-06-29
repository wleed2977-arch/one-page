import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/view/:slug', analyticsController.recordView);
router.get('/my', protect, analyticsController.getMyAnalytics);

export default router;
