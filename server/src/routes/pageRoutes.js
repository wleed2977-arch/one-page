import express from 'express';
import * as pageController from '../controllers/pageController.js';
import { validate } from '../middlewares/validate.js';
import { protect, requireAdmin } from '../middlewares/auth.js';
import { updatePageSchema, saveWidgetsSchema } from '../validators/pageValidator.js';

const router = express.Router();

router.get('/my', protect, pageController.getMyPage);
router.put('/my', protect, validate(updatePageSchema), pageController.updateMyPage);
router.put('/my/widgets', protect, validate(saveWidgetsSchema), pageController.saveMyWidgets);
router.get('/', protect, requireAdmin, pageController.getPages);
router.get('/:slug', pageController.getPageBySlug);

export default router;
