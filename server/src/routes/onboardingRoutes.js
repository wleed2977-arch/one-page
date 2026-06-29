import express from 'express';
import * as onboardingController from '../controllers/onboardingController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { completeOnboardingSchema } from '../validators/onboardingValidator.js';

const router = express.Router();

router.use(protect);

router.get('/status', onboardingController.getStatus);
router.post('/complete', validate(completeOnboardingSchema), onboardingController.complete);

export default router;
