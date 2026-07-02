import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {
  resolveDatabaseUrl,
  isHostedRuntime,
  ensureHostedEnv,
} from './server/src/config/resolveDatabaseUrl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, 'server');

dotenv.config({ path: path.join(serverDir, '.env') });

ensureHostedEnv();
resolveDatabaseUrl();

if (!process.env.CLIENT_URL && process.env.RENDER_EXTERNAL_URL) {
  process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
}

if ((process.env.NODE_ENV === 'production' || isHostedRuntime()) && !process.env.JWT_SECRET) {
  console.warn(
    '[OnePage] JWT_SECRET is not set. Using a temporary secret — add JWT_SECRET in Render Environment for stable sessions.'
  );
  process.env.JWT_SECRET = `onepage-render-${process.env.RENDER_SERVICE_ID || 'default'}`;
}

try {
  console.log('[OnePage] Running database migrations...');
  execSync('npm run prisma:deploy -w server', {
    cwd: __dirname,
    stdio: 'inherit',
    env: process.env,
  });
} catch (err) {
  console.error('[OnePage] Database migration failed:', err.message);
  if (isHostedRuntime()) {
    console.error(
      '[OnePage] Verify DATABASE_URL points to your Render Postgres Internal URL and the database is running.'
    );
  }
  process.exit(1);
}

await import('./server/src/server.js');
