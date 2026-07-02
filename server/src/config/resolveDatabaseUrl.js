const LOCAL_DATABASE_URL =
  'postgresql://onepage:onepagepassword@localhost:5432/onepagedb?schema=public';

/** True when running on Render (even if NODE_ENV was not set in the dashboard). */
export const isHostedRuntime = () =>
  Boolean(
    process.env.RENDER === 'true' ||
      process.env.RENDER_SERVICE_ID ||
      process.env.RENDER_EXTERNAL_URL
  );

export const ensureHostedEnv = () => {
  if (isHostedRuntime() && !process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
  }
};

const withSslIfNeeded = (url) => {
  if (!/render\.com/i.test(url) || /sslmode=/i.test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
};

export const resolveDatabaseUrl = () => {
  ensureHostedEnv();

  const configured = process.env.DATABASE_URL?.trim();

  if (configured) {
    process.env.DATABASE_URL = withSslIfNeeded(configured);
    return process.env.DATABASE_URL;
  }

  if (process.env.NODE_ENV === 'production' || isHostedRuntime()) {
    console.error(`
[OnePage] DATABASE_URL is not set.

On Render:
  1. Create a PostgreSQL database (e.g. onepage-db).
  2. Open web service "onepage" → Environment.
  3. Add DATABASE_URL = Internal Database URL from the Postgres service.
     Or: Connections → Link database (injects DATABASE_URL automatically).

Required environment variables on Render:
  - DATABASE_URL  (from linked Postgres)
  - JWT_SECRET    (any long random string)
  - NODE_ENV      (production) — optional if using Render hosting
`);
    process.exit(1);
  }

  process.env.DATABASE_URL = LOCAL_DATABASE_URL;
  return process.env.DATABASE_URL;
};
