import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, 'server');

dotenv.config({ path: path.join(serverDir, '.env') });

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  process.env.DATABASE_URL =
    'postgresql://onepage:onepagepassword@localhost:5432/onepagedb?schema=public';
}

if (!process.env.CLIENT_URL && process.env.RENDER_EXTERNAL_URL) {
  process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn(
    '[OnePage] JWT_SECRET is not set. Using a temporary secret — add JWT_SECRET in Render Environment for stable sessions.'
  );
  process.env.JWT_SECRET = `onepage-render-${process.env.RENDER_SERVICE_ID || 'default'}`;
}

try {
  console.log('[OnePage] Running database migrations...');
  execSync('npx prisma migrate deploy', {
    cwd: serverDir,
    stdio: 'inherit',
    env: process.env,
  });
} catch (err) {
  console.error('[OnePage] Database migration failed:', err.message);
  process.exit(1);
}

await import('./server/src/server.js');
