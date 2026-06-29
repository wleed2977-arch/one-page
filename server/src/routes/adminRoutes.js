import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/users', adminController.getUsers);

export default router;
