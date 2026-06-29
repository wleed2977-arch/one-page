import express from 'express';
import * as exportController from '../controllers/exportController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', exportController.exportWebsite);

export default router;
