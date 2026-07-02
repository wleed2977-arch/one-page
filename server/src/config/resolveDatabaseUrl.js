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

const appendParam = (url, key, value) => {
  if (new RegExp(`${key}=`, 'i').test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${key}=${value}`;
};

const normalizeDatabaseUrl = (url) => {
  let result = url.trim();

  // External Render Postgres URLs require SSL.
  if (/render\.com/i.test(result)) {
    result = appendParam(result, 'sslmode', 'require');
  }

  // Free-tier Postgres can take time to wake up on deploy.
  if (isHostedRuntime()) {
    result = appendParam(result, 'connect_timeout', '30');
  }

  result = appendParam(result, 'schema', 'public');
  return result;
};

export const resolveDatabaseUrl = () => {
  ensureHostedEnv();

  const configured =
    process.env.DATABASE_URL?.trim() || process.env.DATABASE_INTERNAL_URL?.trim();

  if (configured) {
    process.env.DATABASE_URL = normalizeDatabaseUrl(configured);
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
  - NODE_ENV      (production) — optional on Render
`);
    process.exit(1);
  }

  process.env.DATABASE_URL = LOCAL_DATABASE_URL;
  return process.env.DATABASE_URL;
};

export const logDatabaseTarget = () => {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(
      `[OnePage] Database target: ${url.hostname}:${url.port || '5432'}${url.pathname}`
    );
  } catch {
    console.warn('[OnePage] Could not parse DATABASE_URL for logging.');
  }
};
