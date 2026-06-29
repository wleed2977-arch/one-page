import express from 'express';
import rateLimit from 'express-rate-limit';
import * as contactController from '../controllers/contactController.js';
import { validate } from '../middlewares/validate.js';
import { contactMessageSchema } from '../validators/contactValidator.js';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many messages. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/:slug', contactLimiter, validate(contactMessageSchema), contactController.submitMessage);

export default router;
