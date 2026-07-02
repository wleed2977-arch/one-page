# 13 — FAQ (Frequently Asked Questions)

**Audience:** Beginners with "why?" questions.  
**Prerequisites:** Any chapter — cross-linked throughout.  
**Format:** Question → thorough answer with chapter links where relevant.

---

## Architecture (15 questions)

### 1. Why do we need a backend at all?
The backend protects secrets (database passwords, JWT signing key), hashes passwords, and enforces rules. Browsers cannot safely do these jobs. See [Chapter 01](01_FULL_ARCHITECTURE_GUIDE.md).

### 2. Why not connect HTML directly to PostgreSQL?
Browsers would need database credentials embedded in JavaScript — anyone could steal them. SQL would also be exposed to manipulation. The backend is the secure gatekeeper.

### 3. Why is this called a "full-stack" application?
It has a **full stack** of layers: frontend (browser), backend (server), and database. You work with all three.

### 4. Why use a monorepo (client + server in one repo)?
Easier to keep frontend and API in sync, one clone, one deploy config (`render.yaml`), shared versioning.

### 5. Why does development use two servers but production uses one?
Vite's dev server offers hot reload and fast iteration. Production bundles the frontend into static files Express can serve efficiently from one process.

### 6. What is the difference between `index.js` and `server.js`?
`index.js` is the production entry: migrations then server. `server.js` just starts listening. Dev uses `server.js` directly without `index.js`.

### 7. Why does Express serve the frontend in production?
Simplifies deployment — one URL, no CORS issues, one hosting bill. The SPA and API share the same origin.

### 8. What is an SPA and why did OnePage choose it?
A Single-Page Application loads once and swaps content with JavaScript. Smoother dashboard/builder navigation without full page reloads. See [Chapter 03](03_FRONTEND_GUIDE.md).

### 9. Why vanilla JavaScript instead of React?
Lower learning curve, fewer dependencies, clearer mapping to HTML/CSS/JS fundamentals. React is a great next step after understanding this project.

### 10. What is separation of concerns?
Each part has one job: widgets render UI, services hold business logic, repositories talk to the database. Easier to maintain and test.

### 11. Why is the API versioned (`/api/v1`)?
Allows future breaking changes under `/api/v2` without breaking existing clients.

### 12. What happens when I refresh the page on `/dashboard`?
Express serves `index.html` (SPA fallback), then the client router reads the URL and renders the dashboard. See [Chapter 04](04_BACKEND_GUIDE.md).

### 13. Why is there an `index.js` at the root instead of only in server?
Root `index.js` orchestrates production concerns (env, migrations) before importing the server — one command for hosting platforms.

### 14. Can OnePage work offline?
No. It requires the API for auth, saving, and loading pages. Offline support would need Service Workers and local caching — not implemented.

### 15. What is the difference between stateless and stateful servers?
Stateless: server doesn't store session data; JWT carries identity. Stateful: server stores sessions in memory/Redis. OnePage uses stateless JWT.

---

## Frontend (15 questions)

### 16. Why a custom router instead of a library?
Educational clarity — you can read all routing logic in one file ([`router.js`](../client/scripts/core/router.js)). Libraries like React Router add features but also abstraction.

### 17. Why `render()` and `afterRender()` on every page?
Separates HTML generation from side effects (API calls, event binding). Keeps templates readable.

### 18. Why use `innerHTML` instead of a framework virtual DOM?
Simplicity. `innerHTML` is fast to implement for a learning project. Frameworks optimize diffing and updates at scale.

### 19. Why are widgets classes instead of functions?
Classes bundle data, render, serialize (`toJSON`), and schema (`getPropertiesSchema`) in one unit — similar to OOP components.

### 20. What is the widget registry?
A map from type string (`hero`) to class (`HeroWidget`) in [`widgets/index.js`](../client/scripts/widgets/index.js). Enables dynamic creation from API data.

### 21. Why disable inputs on public pages except contact?
Visitors should read content, not edit it. Contact is the one interactive feature meant for visitors.

### 22. Why does the builder warn about unsaved changes?
Widget edits live in browser memory until Save. `beforeunload` prevents accidental data loss.

### 23. Why load Chart.js from CDN only on the analytics page?
Reduces initial bundle size. Chart.js is only needed on one page.

### 24. Why Lucide icons from CDN?
No npm dependency for icons. CDN loads icons on demand. Tradeoff: requires internet in dev.

### 25. What is `data-link` and why not normal `<a href>`?
Normal links cause full page reloads, wiping SPA state. `data-link` triggers client-side `navigate()`.

### 26. Why does the dashboard always use the light theme?
Consistent tool UI. User's creative theme applies to their public page, not the editing experience. See [Chapter 08](08_UI_UX_GUIDE.md).

### 27. What is scoped theme preview?
`applyScopedTheme` sets `data-theme` on a container (builder canvas) without changing the whole app. Preview without publishing.

### 28. Why is global state minimal?
Most state is page-specific (builder widgets). Only `user` needs to be global for auth guards. Simpler than Redux for this scale.

### 29. What is event delegation?
Attaching one listener on a parent for many children (e.g. widget clicks). Handles dynamically added elements.

### 30. Why does the public page animate widgets on load?
Polish and perceived quality. CSS `animate-in` classes stagger entrance. Respects user motion preferences where configured.

---

## Backend (15 questions)

### 31. Why Express and not Fastify/Koa?
Express is the most widely taught Node framework with the largest ecosystem. Great for beginners.

### 32. Why controllers AND services?
Controllers handle HTTP; services handle business rules. You can test services without mocking HTTP. See [Chapter 04](04_BACKEND_GUIDE.md).

### 33. Why the repository pattern?
Isolates Prisma queries. If you switch databases or ORMs, you change repositories — not every service.

### 34. Why do some controllers skip the service layer?
Pragmatism for simple features (admin list, file upload). A learning project balances purity with progress. Refactor later.

### 35. What is middleware and why does order matter?
Middleware runs in sequence. `cookieParser` must run before routes that read cookies. `errorHandler` must be last.

### 36. Why throw `{ statusCode, message }` instead of custom Error classes?
Simple pattern for beginners. Works with the global error handler. Custom error classes are a good refactor.

### 37. Why Morgan logging?
Quick visibility into every HTTP request during development. See method, path, status, timing in terminal.

### 38. Why compression middleware?
Gzip reduces response size — faster loads for JSON and HTML.

### 39. Why Helmet?
Sets security-related HTTP headers automatically — low effort, meaningful protection.

### 40. What is `next()` in Express middleware?
Passes control to the next middleware or route handler. Forgetting `next()` hangs the request.

### 41. Why separate route files per domain?
Organization. `authRoutes.js` only handles auth — easier to find and modify.

### 42. Why is `/pages/my` registered before `/pages/:slug`?
Express matches in order. Otherwise `my` would be interpreted as a slug parameter.

### 43. What does `protect` middleware do?
Reads JWT from cookie or header, verifies it, loads user, sets `req.user`. Blocks request if invalid.

### 44. Why `0.0.0.0` bind address?
Allows connections from outside localhost — required for Docker containers and cloud hosts like Render.

### 45. Why run migrations on startup in production?
Ensures database schema matches code on every deploy. Render may start before DB is ready — retries handle that.

---

## Database (12 questions)

### 46. Why PostgreSQL instead of SQLite?
PostgreSQL handles concurrent users, production hosting, and scales beyond a single file. SQLite is great for prototypes; this project targets production deployment.

### 47. Why Prisma instead of raw SQL?
Safer queries (no SQL injection), readable JavaScript API, built-in migrations. Beginners learn faster.

### 48. What is a migration?
A versioned SQL file changing database structure. Tracked in `prisma/migrations/`. Applied with `migrate dev` or `migrate deploy`.

### 49. Why JSON inside Widget.data?
Each widget type has different fields. JSON avoids a new table or migration for every widget property. See [Chapter 05](05_DATABASE_GUIDE.md).

### 50. Why delete all widgets then recreate on save?
Simplest correct approach for beginners. Tradeoff: widget IDs change every save. Upsert by ID is more advanced.

### 51. What is a transaction?
Multiple database operations that succeed or fail together. If `createMany` fails, `deleteMany` is rolled back.

### 52. Why cascade delete on User?
Prevents orphaned pages and widgets when an account is deleted. Keeps database consistent.

### 53. Why are Project, Skill tables unused?
Schema was designed for normalized data. Implementation chose JSON in widgets for speed. Tables remain for future refactoring.

### 54. What is `@unique` in Prisma?
Database constraint — no two rows can have the same value. Used for email, slug, username.

### 55. What is a UUID primary key?
Random unique ID like `a1b2c3d4-...`. Safer to expose than auto-increment integers (harder to guess other IDs).

### 56. Why one Page per user at registration?
Simplifies MVP — OnePage is literally one page per user. Multi-page support would need schema and UI changes.

### 57. What is Prisma Studio?
GUI for browsing and editing database rows. Run `npx prisma studio` in `server/`.

---

## Authentication & Security (15 questions)

### 58. Why JWT?
Stateless authentication — server verifies a signed token without storing sessions. Scales across multiple server instances.

### 59. Why JWT in cookies instead of localStorage?
httpOnly cookies cannot be read by JavaScript — protects against XSS stealing tokens. See [Chapter 07](07_SECURITY_GUIDE.md).

### 60. Why not sessions in Redis?
Simpler deployment — no extra Redis service. JWT is sufficient at this scale. Redis sessions are better for instant revocation.

### 61. Why bcrypt and not SHA256?
SHA256 is fast — attackers can guess billions of passwords per second. bcrypt is intentionally slow.

### 62. What is the salt in bcrypt?
Random data added before hashing so identical passwords produce different hashes. bcrypt handles this internally.

### 63. Why 7-day token expiry?
Balance between security (shorter = safer) and convenience (users don't log in daily). Configurable in `jwt.js`.

### 64. What is `sameSite: strict`?
Cookie is only sent for same-site requests — reduces CSRF risk.

### 65. What is CORS?
Browser security blocking cross-origin requests unless server explicitly allows. OnePage allowlists dev and production origins.

### 66. Why `credentials: true` in CORS?
Allows browser to send cookies on cross-origin requests — needed in dev (5173 → 3000).

### 67. What is rate limiting?
Caps requests per IP per time window. Slows brute-force attacks and spam.

### 68. Can I use the API from Postman?
Yes. Login, copy JWT from Set-Cookie, or use `Authorization: Bearer <token>` header.

### 69. What happens if JWT_SECRET changes?
All existing tokens become invalid — every user must log in again. Keep secret stable in production.

### 70. Why hide error details in production?
Prevents leaking internal paths, SQL, or stack traces to attackers.

### 71. Is the contact form protected from spam?
Partially — 10 submissions per hour per IP. Not foolproof; CAPTCHA would be stronger.

### 72. What is SQL injection and are we safe?
Injecting malicious SQL through input. Prisma parameterizes queries — safe when using Prisma APIs, not raw string SQL.

---

## API & HTTP (12 questions)

### 73. What is REST?
Architectural style using HTTP methods on named resources. OnePage uses RESTful patterns at `/api/v1`.

### 74. Why GET for reads and POST for creates?
HTTP method semantics. GET should not change server state. POST creates resources or triggers actions.

### 75. Why PUT for widget save and not PATCH?
PUT replaces the full widget set. PATCH would update partial fields — more complex for array replace logic.

### 76. What is a 401 vs 403?
401: not authenticated (no/invalid token). 403: authenticated but not allowed (e.g. non-admin).

### 77. What is a 409 Conflict?
Request valid but conflicts with current state — e.g. slug already taken.

### 78. Why JSON for request and response bodies?
Universal format both JavaScript and Express parse natively. Human-readable in DevTools.

### 79. What are headers?
Metadata on HTTP messages. `Content-Type: application/json`, `Set-Cookie`, `Authorization`.

### 80. Why `/api/v1` prefix?
Namespaces API routes away from SPA routes (`/dashboard`, `/p/slug`). Version allows future API changes.

### 81. Why standard response shape `{ success, message, data }`?
Consistent frontend parsing. `http.js` always knows where to find data and errors.

### 82. Why 30-second timeout on fetch?
Hosted free tiers (Render) may sleep — requests can be slow on first wake. Timeout gives a friendly error.

### 83. Why multipart for image upload?
Files cannot be sent as JSON. `multipart/form-data` encodes binary file data. See `upload.api.js`.

### 84. What is idempotency and does it matter?
Repeating a request has the same effect. Important for payments; less critical for widget save at this scale.

---

## DevOps & Environment (12 questions)

### 85. Why environment variables?
Secrets and config differ per environment (dev vs prod). Never hardcode in source code or commit to Git.

### 86. Why `.env.example` but not `.env` in Git?
Example shows required keys without real secrets. Each developer/platform sets their own `.env`.

### 87. Why Render for deployment?
Free tier, PostgreSQL included, `render.yaml` for infrastructure-as-code, GitHub integration. Beginner-friendly PaaS.

### 88. What is `render.yaml`?
Blueprint telling Render to create Postgres + web service with correct build/start commands and env linking.

### 89. Why delete `server/.env` during Render build?
Prevents accidentally using local SQLite or dev secrets in production.

### 90. What is `CLIENT_URL` for?
CORS origin in production. Must match the URL users visit in their browser.

### 91. Why is Cloudinary optional?
Local file storage works for development. Cloudinary needed for reliable production image hosting without filling server disk.

### 92. Why is OpenAI optional?
AI bio generation is a nice-to-have. App works without `OPENAI_API_KEY`.

### 93. Why is SMTP optional?
Contact form still saves messages to database. Email delivery requires mail server configuration.

### 94. What is HTTPS and why does it matter?
Encrypted HTTP. Required for `secure` cookies and user trust. Render provides HTTPS automatically.

### 95. What is a build step?
Transforming source code into production-ready output. Vite bundles client; Prisma generates client code.

### 96. How do updates reach production?
Push to Git → Render rebuilds → migrations run → server restarts. See [Chapter 10](10_DEPLOYMENT_GUIDE.md).

---

## UX & Product (10 questions)

### 97. Why an onboarding wizard?
Reduces blank-page anxiety. Users see a complete page immediately, then customize. Higher activation rates.

### 98. Why six themes?
Enough variety without overwhelming choice. Each theme is a CSS file overriding variables.

### 99. Why export as ZIP?
Lets users own their content offline — HTML snapshot they can host elsewhere.

### 100. Why first-party analytics instead of Google Analytics?
Privacy-friendly, no third-party scripts, simpler GDPR story, educational value of building it yourself.

### 101. Why admin panel?
Demonstrates role-based authorization. Admins can list users for support/moderation.

### 102. Why slug in URL (`/p/name`)?
Readable, shareable URLs. Better than `/p/uuid` for personal branding.

### 103. Why confirm before saving empty page?
Prevents accidental deletion of all widgets — destructive action deserves confirmation.

### 104. Why copy button on public link?
Reduces friction sharing portfolio on LinkedIn, Twitter, resumes.

### 105. Why hero CTA scrolls to contact?
Common portfolio pattern — visitor interested in headline can reach contact quickly.

---

## Git & Workflow (8 questions)

### 106. Why use Git?
Track history, revert mistakes, collaborate, trigger deploys. Industry standard.

### 107. Why branches?
Isolate work in progress from stable `main`. Feature branches enable safe experimentation.

### 108. What is a Pull Request?
Proposal to merge changes with review and discussion before they hit production.

### 109. Why not commit `node_modules`?
Huge, platform-specific, reproducible from `package.json` via `npm install`.

### 110. Why not commit `client/dist`?
Generated output — source of truth is `client/scripts` and `client/styles`. Build in CI/deploy.

### 111. What is `.gitignore`?
Lists files Git should never track — secrets, build output, dependencies.

### 112. Should I fork or clone?
Clone if you own the repo. Fork on GitHub to contribute to someone else's project.

### 113. What commit message style should I use?
Clear, complete sentences describing why. Optional prefixes: `feat:`, `fix:`, `docs:`.

---

## Debugging & Troubleshooting (10 questions)

### 114. Why "Failed to fetch" in browser?
Server not running, wrong port, or network issue. Run `npm run dev` with both client and server.

### 115. Why 401 on every protected route?
Not logged in, expired token, or cookie not sent. Check `credentials: 'include'` and Cookies in DevTools.

### 116. Why CORS error in development?
Vite or Express not running, or `CLIENT_URL` mismatch. Both ports 5173 and 3000 must work together.

### 117. Why migration fails on Render?
Database not ready, wrong `DATABASE_URL`, or SQLite URL instead of PostgreSQL. Check Render dashboard.

### 118. Why blank page in production?
`client/dist` not built. Ensure build command runs `npm run build`.

### 119. Why images broken after upload?
Check response URL. Local uploads need `/uploads` static route. Cloudinary needs correct env vars.

### 120. Why Prisma P2002 error?
Unique constraint violation — duplicate email, slug, or username.

### 121. How do I debug the backend?
Read terminal Morgan logs, add `console.log` in services, test with curl, use Prisma Studio.

### 122. How do I debug the frontend?
Browser Console and Network tab. Breakpoints in Sources panel.

### 123. Why does login work locally but not on Render?
Check `CLIENT_URL`, HTTPS, `JWT_SECRET`, and `DATABASE_URL` in Render environment.

---

## Concepts & Comparisons (12 questions)

### 124. OnePage vs WordPress?
WordPress is a CMS with PHP and plugins. OnePage is a custom app with a visual builder — more control, more code to maintain.

### 125. OnePage vs Linktree?
Linktree is link-in-bio focused. OnePage is a full portfolio page with rich widgets and themes.

### 126. Why not Firebase?
Firebase is BaaS (Backend as a Service). OnePage teaches traditional Express + SQL — more transferable to jobs.

### 127. Why not MongoDB?
PostgreSQL is relational — fits users, pages, widgets with clear relationships. MongoDB is document-based; also valid but different modeling style.

### 128. What is hydration?
Applying client JS to server-rendered HTML. OnePage does client-side rendering only — no hydration.

### 129. What is SSR?
Server-Side Rendering — HTML generated on server per request. OnePage uses CSR (Client-Side Rendering).

### 130. What is a CDN?
Geographically distributed cache for static assets. Cloudinary serves images from edge locations.

### 131. What is a reverse proxy?
Server in front of your app handling SSL, routing, load balancing. Render provides this; you use Nginx on VPS.

### 132. What is a load balancer?
Distributes traffic across multiple app instances. Not needed until traffic exceeds one server.

### 133. What is Docker?
Packages app and dependencies in a container. Consistent environments — learn after mastering basic deploy.

### 134. What is CI/CD?
Continuous Integration/Deployment — automated tests and deploys on git push. GitHub Actions + Render is a common combo.

### 135. What should I learn after this project?
TypeScript, testing, React, Docker — see [Chapter 15](15_NEXT_STEPS.md).

---

## Quick Index by Topic

| Topic | Questions |
|-------|-----------|
| Architecture | 1–15 |
| Frontend | 16–30 |
| Backend | 31–45 |
| Database | 46–57 |
| Security | 58–72 |
| API/HTTP | 73–84 |
| DevOps | 85–96 |
| UX/Product | 97–105 |
| Git | 106–113 |
| Debugging | 114–123 |
| Comparisons | 124–135 |

**Total: 135 questions**

For term definitions, see [Glossary](14_GLOSSARY.md).
