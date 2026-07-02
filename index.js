import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {
  resolveDatabaseUrl,
  isHostedRuntime,
  ensureHostedEnv,
  logDatabaseTarget,
} from './server/src/config/resolveDatabaseUrl.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.join(__dirname, 'server');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// On Render, only use dashboard env vars — never a local server/.env (often SQLite).
const hostedDatabaseUrl = isHostedRuntime() ? process.env.DATABASE_URL?.trim() : null;

if (!isHostedRuntime()) {
  dotenv.config({ path: path.join(serverDir, '.env') });
} else if (hostedDatabaseUrl) {
  process.env.DATABASE_URL = hostedDatabaseUrl;
}

ensureHostedEnv();
resolveDatabaseUrl();
logDatabaseTarget();

if (!process.env.CLIENT_URL && process.env.RENDER_EXTERNAL_URL) {
  process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
}

if ((process.env.NODE_ENV === 'production' || isHostedRuntime()) && !process.env.JWT_SECRET) {
  console.warn(
    '[OnePage] JWT_SECRET is not set. Using a temporary secret — add JWT_SECRET in Render Environment for stable sessions.'
  );
  process.env.JWT_SECRET = `onepage-render-${process.env.RENDER_SERVICE_ID || 'default'}`;
}

const migrationEnv = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL,
};

const runMigrations = async () => {
  const maxAttempts = isHostedRuntime() ? 8 : 1;
  const retryDelaysMs = [3000, 5000, 8000, 10000, 12000, 15000, 15000, 15000];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[OnePage] Running database migrations (attempt ${attempt}/${maxAttempts})...`);
      execSync('npx prisma migrate deploy --schema prisma/schema.prisma', {
        cwd: serverDir,
        stdio: 'inherit',
        env: migrationEnv,
      });
      console.log('[OnePage] Database migrations complete.');
      return;
    } catch (err) {
      const isLast = attempt === maxAttempts;
      console.error(`[OnePage] Migration attempt ${attempt} failed:`, err.message);

      if (isLast) {
        if (isHostedRuntime()) {
          console.error(`
[OnePage] Could not run migrations after ${maxAttempts} attempts.

Check on Render:
  - DATABASE_URL is the Postgres Internal URL (postgresql://...), not file: or dev.db.
  - Web service is linked to the database (Connections tab).
  - Postgres status is "Available".
`);
        }
        throw err;
      }

      const waitMs = retryDelaysMs[attempt - 1] ?? 15000;
      console.log(`[OnePage] Retrying in ${waitMs / 1000}s...`);
      await sleep(waitMs);
    }
  }
};

try {
  await runMigrations();
} catch {
  process.exit(1);
}

await import('./server/src/server.js');
