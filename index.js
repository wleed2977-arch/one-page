import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

if (!process.env.CLIENT_URL && process.env.RENDER_EXTERNAL_URL) {
  process.env.CLIENT_URL = process.env.RENDER_EXTERNAL_URL;
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn(
    '[OnePage] JWT_SECRET is not set. Using a temporary secret — add JWT_SECRET in Render Environment for stable sessions.'
  );
  process.env.JWT_SECRET = `onepage-render-${process.env.RENDER_SERVICE_ID || 'default'}`;
}

await import('./server/src/server.js');
