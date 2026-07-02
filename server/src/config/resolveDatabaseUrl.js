const LOCAL_DATABASE_URL =
  'postgresql://onepage:onepagepassword@localhost:5432/onepagedb?schema=public';

const withSslIfNeeded = (url) => {
  if (!/render\.com/i.test(url) || /sslmode=/i.test(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
};

export const resolveDatabaseUrl = () => {
  const configured = process.env.DATABASE_URL?.trim();

  if (configured) {
    process.env.DATABASE_URL = withSslIfNeeded(configured);
    return process.env.DATABASE_URL;
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(`
[OnePage] DATABASE_URL is not set.

On Render:
  1. Create or open your PostgreSQL database (onepage-db).
  2. Open the web service → Environment.
  3. Add DATABASE_URL using the database Internal Connection String,
     or link the database under Connections so Render injects it.

If you use render.yaml as a Blueprint, redeploy the blueprint so
fromDatabase links onepage-db to the web service.
`);
    process.exit(1);
  }

  process.env.DATABASE_URL = LOCAL_DATABASE_URL;
  return process.env.DATABASE_URL;
};
