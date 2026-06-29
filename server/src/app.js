import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';
import { sendResponse } from './utils/response.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

app.use(helmet());
const devOrigins = [
  ENV.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: ENV.NODE_ENV === 'production'
    ? [ENV.CLIENT_URL, ENV.CLIENT_URL?.replace(/\/$/, '')].filter(Boolean)
    : devOrigins,
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});
app.use('/api', limiter);

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));

app.get('/api/v1/health', (req, res) => {
  sendResponse(res, 200, true, 'OnePage API v1 is running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/export', exportRoutes);
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/contact', contactRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDist = path.join(__dirname, '../../client/dist');
const clientSource = path.join(__dirname, '../../client');
const staticRoot = fs.existsSync(path.join(clientDist, 'index.html'))
  ? clientDist
  : clientSource;

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(staticRoot));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return sendResponse(res, 404, false, 'API route not found');
  }
  res.sendFile(path.join(staticRoot, 'index.html'));
});

app.use(errorHandler);

export default app;
