import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { updateProfileSchema } from '../validators/profileValidator.js';

const router = express.Router();

router.use(protect);

router.get('/me', profileController.getMyProfile);
router.put('/me', validate(updateProfileSchema), profileController.updateMyProfile);

export default router;
