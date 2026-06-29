import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js'; // Note we moved this
import { protect } from '../middlewares/auth.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getCurrentUser);

export default router;
