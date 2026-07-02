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

export const isPostgresUrl = (url) => /^postgres(ql)?:\/\//i.test(url?.trim() || '');

const appendParam = (url, key, value) => {
  if (new RegExp(`${key}=`, 'i').test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${key}=${value}`;
};

const normalizeDatabaseUrl = (url) => {
  let result = url.trim();

  if (/render\.com/i.test(result)) {
    result = appendParam(result, 'sslmode', 'require');
  }

  if (isHostedRuntime()) {
    result = appendParam(result, 'connect_timeout', '30');
  }

  result = appendParam(result, 'schema', 'public');
  return result;
};

const rejectInvalidHostedDatabaseUrl = (url) => {
  if (!isPostgresUrl(url)) {
    console.error(`
[OnePage] DATABASE_URL must be a PostgreSQL connection string on Render.

Current value points to SQLite or a file path:
  ${url}

Fix in Render → web service "onepage" → Environment:
  1. Delete the current DATABASE_URL value.
  2. Open your PostgreSQL service → Connect → copy "Internal Database URL".
  3. Paste it as DATABASE_URL (must start with postgresql://).

Or link the database under Connections so Render injects the correct URL.
`);
    process.exit(1);
  }
};

export const resolveDatabaseUrl = () => {
  ensureHostedEnv();

  const configured =
    process.env.DATABASE_URL?.trim() || process.env.DATABASE_INTERNAL_URL?.trim();

  if (configured) {
    if (isHostedRuntime() || process.env.NODE_ENV === 'production') {
      rejectInvalidHostedDatabaseUrl(configured);
    }
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
  - DATABASE_URL  (postgresql://... from linked Postgres)
  - JWT_SECRET    (any long random string)
`);
    process.exit(1);
  }

  process.env.DATABASE_URL = LOCAL_DATABASE_URL;
  return process.env.DATABASE_URL;
};

export const logDatabaseTarget = () => {
  const url = process.env.DATABASE_URL;
  if (!isPostgresUrl(url)) {
    console.warn(`[OnePage] Database target is not PostgreSQL: ${url}`);
    return;
  }

  try {
    const parsed = new URL(url);
    console.log(
      `[OnePage] Database target: ${parsed.hostname}:${parsed.port || '5432'}${parsed.pathname}`
    );
  } catch {
    console.warn('[OnePage] Could not parse DATABASE_URL for logging.');
  }
};
