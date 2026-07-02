# 14 — Glossary

**Audience:** All readers — use as a reference while studying other chapters.  
**Prerequisites:** None  
**Format:** Alphabetical. Each entry: definition + "In OnePage" one-liner.

---

## A

**API (Application Programming Interface)**  
A contract for how software components communicate.  
*In OnePage:* REST API at `/api/v1` connects the SPA to Express.

**Analytics**  
Measurement of user behavior or traffic.  
*In OnePage:* First-party page view counts stored in `AnalyticsRecord`.

**Async/Await**  
JavaScript syntax for handling asynchronous operations without nested callbacks.  
*In OnePage:* `afterRender` and API calls use `async/await`.

**Authentication**  
Verifying who a user is.  
*In OnePage:* Login with email/password → JWT cookie.

**Authorization**  
Determining what an authenticated user may do.  
*In OnePage:* `requireAdmin` restricts admin routes.

---

## B

**Backend**  
Server-side code that handles logic, data, and security.  
*In OnePage:* Express app in `server/src/`.

**bcrypt**  
Password hashing algorithm designed to be slow.  
*In OnePage:* Hashes passwords with cost factor 10 in `authService`.

**Branch (Git)**  
Independent line of development.  
*In OnePage:* Feature branches merge to `main` via Pull Request.

**Browser**  
Software that renders web pages (Chrome, Firefox, etc.).  
*In OnePage:* Runs the SPA and stores httpOnly cookies.

**Build**  
Process of compiling/preparing code for production.  
*In OnePage:* `npm run build` creates `client/dist` and generates Prisma client.

---

## C

**Cache / Caching**  
Storing copies of data for faster retrieval.  
*In OnePage:* Not implemented; suggested improvement in [Chapter 15](15_NEXT_STEPS.md).

**Cascade Delete**  
Automatically deleting child records when parent is deleted.  
*In OnePage:* Deleting a User deletes their Pages and Widgets.

**CDN (Content Delivery Network)**  
Distributed servers that deliver static assets from locations near users.  
*In OnePage:* Cloudinary acts as CDN for uploaded images.

**Client**  
The side that requests data — typically the browser.  
*In OnePage:* Vanilla JS SPA in `client/`.

**Commit (Git)**  
A saved snapshot of changes with a message.  
*In OnePage:* Each feature or fix should be a focused commit.

**Component**  
Reusable UI unit.  
*In OnePage:* Page components and widget classes.

**Controller**  
HTTP adapter that calls services and sends responses.  
*In OnePage:* `authController.js`, `pageController.js`, etc.

**Cookie**  
Small data stored by the browser and sent with requests.  
*In OnePage:* `jwt` httpOnly cookie holds authentication token.

**CORS (Cross-Origin Resource Sharing)**  
Browser security allowing controlled cross-origin requests.  
*In OnePage:* CORS allowlist in `app.js` with `credentials: true`.

**CRUD**  
Create, Read, Update, Delete — basic data operations.  
*In OnePage:* Pages and widgets support full CRUD via API.

**CSRF (Cross-Site Request Forgery)**  
Attack tricking a browser into unwanted authenticated requests.  
*In OnePage:* Mitigated by `sameSite: 'strict'` cookies.

---

## D

**Database**  
Persistent structured data storage.  
*In OnePage:* PostgreSQL accessed via Prisma.

**Deployment**  
Publishing an application to a live server.  
*In OnePage:* Render via `render.yaml` and `npm start`.

**DNS (Domain Name System)**  
Translates domain names to IP addresses.  
*In OnePage:* Point custom domain CNAME to Render URL.

**DOM (Document Object Model)**  
Browser tree representation of HTML.  
*In OnePage:* Router sets `innerHTML`; widgets append elements.

---

## E

**Endpoint**  
Specific URL + method an API exposes.  
*In OnePage:* e.g. `GET /api/v1/pages/my`.

**Environment Variable**  
Configuration value outside source code.  
*In OnePage:* `JWT_SECRET`, `DATABASE_URL` in `server/.env`.

**ES Modules**  
JavaScript `import`/`export` file system.  
*In OnePage:* All frontend and backend code uses ES modules.

**Express**  
Minimal Node.js web framework.  
*In OnePage:* Handles routes, middleware, static files.

---

## F

**Foreign Key**  
Column referencing another table's primary key.  
*In OnePage:* `Widget.pageId` references `Page.id`.

**Frontend**  
Code running in the browser.  
*In OnePage:* Vite + vanilla JS SPA.

---

## G

**GET**  
HTTP method to read data.  
*In OnePage:* `GET /pages/:slug` fetches public page.

---

## H

**Hashing**  
One-way transformation of data.  
*In OnePage:* Passwords hashed with bcrypt before storage.

**Hosting**  
Running an app on an internet-connected server.  
*In OnePage:* Recommended on Render (PaaS).

**HTTP**  
Protocol for web request/response.  
*In OnePage:* All API communication uses HTTP/HTTPS.

**httpOnly**  
Cookie flag preventing JavaScript access.  
*In OnePage:* JWT cookie is httpOnly for XSS protection.

**HTTPS**  
HTTP encrypted with TLS/SSL.  
*In OnePage:* Required in production for secure cookies.

**Hydration**  
Attaching client-side JavaScript to server-rendered HTML.  
*In OnePage:* Not used — pure client-side rendering (CSR).

---

## I

**Idempotent**  
Repeating an operation produces the same result.  
*In OnePage:* PUT widget save is idempotent in effect (same payload → same state).

**Index (Database)**  
Structure speeding up queries; unique indexes enforce uniqueness.  
*In OnePage:* `@unique` on email, slug, username.

---

## J

**JSON (JavaScript Object Notation)**  
Text format for structured data.  
*In OnePage:* API bodies and `Widget.data` field.

**JSON Web Token (JWT)**  
Signed token carrying user identity claims.  
*In OnePage:* 7-day token in httpOnly cookie.

---

## L

**Load Balancer**  
Distributes traffic across multiple servers.  
*In OnePage:* Not used; Render handles scaling at platform level.

**LocalStorage**  
Browser key-value storage accessible to JavaScript.  
*In OnePage:* Intentionally not used for auth tokens.

---

## M

**Middleware**  
Functions running between request and response.  
*In OnePage:* auth, validate, rate limit, error handler.

**Migration**  
Versioned database schema change.  
*In OnePage:* `prisma/migrations/` applied on deploy.

**Monorepo**  
One repository containing multiple packages.  
*In OnePage:* `client` and `server` npm workspaces.

**Morgan**  
HTTP request logger middleware.  
*In OnePage:* Logs method, URL, status in dev.

**Multer**  
Express middleware for multipart file uploads.  
*In OnePage:* Handles image upload in memory.

---

## N

**Normalization**  
Organizing database to reduce duplication.  
*In OnePage:* Hybrid — normalized users/pages, denormalized widget JSON.

**Node.js**  
JavaScript runtime outside the browser.  
*In OnePage:* Runs Express server.

---

## O

**ORM (Object-Relational Mapping)**  
Maps database tables to code objects.  
*In OnePage:* Prisma.

---

## P

**PaaS (Platform as a Service)**  
Cloud platform managing infrastructure.  
*In OnePage:* Render hosts app and Postgres.

**Payload**  
Data carried in request or token body.  
*In OnePage:* JWT payload contains `id` and `role`.

**PostgreSQL**  
Open-source relational database.  
*In OnePage:* Production database via `DATABASE_URL`.

**Primary Key**  
Unique identifier for a table row.  
*In OnePage:* UUID `id` fields on all models.

**Prisma**  
Modern ORM for Node.js.  
*In OnePage:* Schema, migrations, and all DB queries.

**Production**  
Live environment used by real users.  
*In OnePage:* `NODE_ENV=production`, single server via `index.js`.

---

## R

**Rate Limiting**  
Restricting requests per time window.  
*In OnePage:* 100/15min API; 10/hr contact form.

**Rendering**  
Generating visual output from data.  
*In OnePage:* Pages return HTML strings; widgets return DOM elements.

**Repository**  
Data access layer abstracting database queries.  
*In OnePage:* `pageRepository.js`, `userRepository.js`.

**REST (Representational State Transfer)**  
API style using HTTP methods on resources.  
*In OnePage:* `/pages`, `/profile`, `/auth` resources.

**Reverse Proxy**  
Server forwarding requests to backend apps.  
*In OnePage:* Render's infrastructure; Nginx on VPS setups.

---

## S

**SameSite**  
Cookie attribute controlling cross-site sending.  
*In OnePage:* `strict` on JWT cookie.

**Schema (Database)**  
Structure defining tables and columns.  
*In OnePage:* `server/prisma/schema.prisma`.

**Secret**  
Private key or password for cryptography.  
*In OnePage:* `JWT_SECRET` must stay out of Git.

**Server**  
Machine or process responding to requests.  
*In OnePage:* Express on port 3000.

**Session**  
Period of authenticated interaction.  
*In OnePage:* JWT cookie represents session (stateless).

**SPA (Single-Page Application)**  
One HTML page; JS handles navigation.  
*In OnePage:* Entire UI in `client/scripts/`.

**SQL Injection**  
Attack inserting malicious SQL via input.  
*In OnePage:* Prevented by Prisma parameterized queries.

**SSL/TLS**  
Encryption for HTTPS.  
*In OnePage:* Provided by Render/Cloudflare.

**Static Files**  
Assets served as-is (HTML, CSS, JS, images).  
*In OnePage:* Express serves `client/dist` in production.

**Status Code**  
HTTP number indicating result (200, 404, 401).  
*In OnePage:* Documented in [Chapter 06](06_API_GUIDE.md).

---

## T

**Theme**  
Visual style configuration.  
*In OnePage:* Six themes via `data-theme` CSS variables.

**Token (JWT)**  
Signed authentication credential.  
*In OnePage:* Stored in httpOnly cookie named `jwt`.

**Transaction**  
Database operations that succeed or fail together.  
*In OnePage:* Widget save uses `prisma.$transaction`.

---

## U

**UUID**  
Universally unique identifier string.  
*In OnePage:* Primary keys like `User.id`.

---

## V

**Validation**  
Checking input meets rules before processing.  
*In OnePage:* Zod schemas in `validators/`.

**Vite**  
Fast frontend build tool and dev server.  
*In OnePage:* Dev server on 5173 with API proxy.

**VPS (Virtual Private Server)**  
Virtual machine you manage.  
*In OnePage:* Advanced deployment option with Nginx + PM2.

---

## W

**Widget**  
Content block on a portfolio page.  
*In OnePage:* Hero, About, Projects, etc. — nine types.

**Workspaces (npm)**  
Monorepo feature linking multiple packages.  
*In OnePage:* Root `package.json` lists `client` and `server`.

---

## X

**XSS (Cross-Site Scripting)**  
Injecting malicious scripts into pages.  
*In OnePage:* Mitigated by httpOnly cookies and careful rendering.

---

## Z

**Zod**  
TypeScript-first schema validation library.  
*In OnePage:* Validates register, login, pages, contact, onboarding input.

---

## Quick Cross-Reference

| Term | Chapter |
|------|---------|
| Architecture | [01](01_FULL_ARCHITECTURE_GUIDE.md) |
| API endpoints | [06](06_API_GUIDE.md) |
| Security | [07](07_SECURITY_GUIDE.md) |
| Database models | [05](05_DATABASE_GUIDE.md) |
| Deployment | [10](10_DEPLOYMENT_GUIDE.md) |
| FAQ | [13](13_FAQ.md) |
