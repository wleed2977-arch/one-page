# 12 — Debugging Guide

**Audience:** Beginners learning to find and fix problems.  
**Prerequisites:** [03 — Frontend Guide](03_FRONTEND_GUIDE.md), [04 — Backend Guide](04_BACKEND_GUIDE.md)  
**What you will learn:** How to debug frontend, backend, database, and network issues in OnePage.

**Read next:** [13 — FAQ](13_FAQ.md)

---

## Debugging Mindset

1. **Reproduce** — can you make it happen again?
2. **Isolate** — frontend, backend, or database?
3. **Read the error** — exact message and stack trace
4. **Check one layer at a time** — don't change everything at once
5. **Verify fix** — test the same steps again

---

## Browser DevTools

Open: `F12` or Right-click → Inspect

### Console tab
- JavaScript errors (red text)
- `console.log` output from your code
- Failed module imports

**Common errors:**
- `Failed to fetch` — server not running or wrong URL
- `Cannot read property of undefined` — missing data from API
- `Unexpected token` — invalid JSON response

### Network tab
- Every HTTP request with status, timing, headers
- Click request → Preview/Response for JSON body
- Check **Cookies** on authenticated requests — is `jwt` sent?

### Application tab
- **Cookies** — verify `jwt` exists after login
- **Local Storage** — OnePage should NOT store JWT here

---

## Frontend Debugging

### Router not rendering
1. Check URL in address bar matches route in [`app.js`](../client/scripts/app.js)
2. Middleware may redirect silently — add `console.log` in `requireAuth`
3. Check `afterRender` errors in Console

### API errors in UI
[`http.js`](../client/scripts/api/http.js) throws friendly messages. Read Network tab for actual status code and server message.

### Builder issues
| Symptom | Check |
|---------|-------|
| Widgets not saving | Network: `PUT /pages/my/widgets` status |
| Dirty warning stuck | `isDirty` flag in builder.page.js |
| Images not showing | Upload response URL; CORS on Cloudinary |
| Properties panel empty | `getPropertiesSchema()` on widget class |

### Theme not applying
- Inspect element for `data-theme` attribute
- Verify correct function: `applyAppBrand` vs `applyPublicTheme` vs `applyScopedTheme`

---

## Backend Debugging

### Server won't start
```bash
cd server
node src/server.js
```
Read terminal output:
- `EADDRINUSE` — port 3000 in use; kill other process or change PORT
- Prisma errors — check `DATABASE_URL`

### Express errors
- **Morgan** logs every request: `GET /api/v1/pages/my 200 45ms`
- **errorHandler** logs stack traces for 500 errors

### Test API with curl
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Login (save cookie)
curl -c cookies.txt -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Authenticated request
curl -b cookies.txt http://localhost:3000/api/v1/pages/my
```

---

## Prisma / Database Debugging

### Prisma Studio
```bash
cd server
npx prisma studio
```
Visual browser for all tables.

### Common Prisma errors

| Error | Meaning | Fix |
|-------|---------|-----|
| `P2002` | Unique constraint failed | Duplicate email or slug |
| `P2025` | Record not found | Wrong ID or deleted row |
| `Can't reach database` | Connection failed | Check DATABASE_URL, Postgres running |

### Migration issues
```bash
cd server
npx prisma migrate status
npx prisma migrate dev    # dev only
npx prisma migrate deploy # production
```

---

## Network Debugging

### CORS errors
```
Access-Control-Allow-Origin
```
- Dev: both 5173 and 3000 must run
- Prod: `CLIENT_URL` must match browser URL exactly

### 401 Unauthorized
- Not logged in
- Cookie expired (7 days)
- `credentials: 'include'` missing from fetch
- Testing API from wrong origin without cookie

### 429 Too Many Requests
- Hit rate limit (100/15min or contact 10/hr)
- Wait or test from different IP

---

## Environment Variable Mistakes

| Symptom | Likely cause |
|---------|--------------|
| CORS failure | Wrong `CLIENT_URL` |
| Random logouts on Render | Unstable `JWT_SECRET` |
| SQLite error message | Old `.env` with `file:` URL — use PostgreSQL |
| Uploads fail | Missing Cloudinary vars (falls back to local — check `/uploads` path) |
| Contact form saves but no email | SMTP not configured (expected in dev) |

---

## Dev vs Production Confusion

| Issue | Dev | Prod |
|-------|-----|------|
| API URL | Proxied via Vite | Same origin as SPA |
| Entry point | `server.js` + Vite | `index.js` |
| Static files | Vite serves client | Express serves `client/dist` |
| Migrations | Manual `migrate dev` | Auto `migrate deploy` on start |

---

## Debugging Checklist

When "it doesn't work":

- [ ] Both `npm run dev` processes running?
- [ ] `server/.env` exists with `JWT_SECRET` and `DATABASE_URL`?
- [ ] `npx prisma migrate dev` applied?
- [ ] Browser Console errors?
- [ ] Network tab status codes?
- [ ] Server terminal errors?
- [ ] Cookie `jwt` present after login?

---

## Node.js Debugging

### Watch mode
Server dev uses `node --watch src/server.js` — auto-restarts on file change.

### VS Code / Cursor
Add launch config to attach debugger to Node process (breakpoints in controllers/services).

---

## Common Beginner Mistakes

1. **Only running client** — API calls fail without Express on 3000
2. **Editing dist/** — changes lost on rebuild
3. **Forgetting `credentials: 'include'`** — auth breaks
4. **Wrong slug format** — must be lowercase, hyphens only
5. **Not awaiting async** — `afterRender` errors silently
6. **Testing production build without build** — run `npm run build` first

---

## Key Takeaways

- DevTools Network + Console are your first tools
- Morgan and errorHandler logs cover the backend
- Prisma Studio visualizes database state
- Most OnePage bugs are env vars, auth cookies, or server not running

---

## Mini Exercise

Break something on purpose (stop the server), observe the error in the browser, fix it, and write down the exact error message.
