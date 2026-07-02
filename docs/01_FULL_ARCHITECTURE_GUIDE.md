# 01 — Full Architecture Guide

**Audience:** Beginners learning full-stack architecture.  
**Prerequisites:** [00 — Project Overview](00_PROJECT_OVERVIEW.md)  
**What you will learn:** How frontend, backend, database, HTTP, authentication, and external services work together in OnePage.

**Read next:** [02 — Folder Structure Guide](02_FOLDER_STRUCTURE_GUIDE.md)

---

## The Big Picture

A **full-stack application** has parts that run in different places:

```mermaid
flowchart TB
  subgraph clientSide [Client Side - Browser]
    HTML[HTML Shell]
    JS[JavaScript SPA]
    CSS[CSS Themes]
  end

  subgraph serverSide [Server Side - Node.js]
    Express[Express App]
    Routes[API Routes]
    Services[Business Logic]
    Prisma[Prisma ORM]
  end

  subgraph storage [Storage]
    PG[(PostgreSQL)]
    CDN[Cloudinary - optional]
  end

  HTML --> JS
  JS -->|HTTP Requests| Express
  Express --> Routes
  Routes --> Services
  Services --> Prisma
  Prisma --> PG
  Express --> CDN
```

---

## Frontend

### Definition
The **frontend** is everything that runs in the user's **browser** — HTML, CSS, and JavaScript that renders pages and handles user interaction.

### Real-life analogy
The frontend is like a restaurant dining room: what customers see, touch, and interact with.

### How it works in OnePage
- Single HTML file: [`client/index.html`](../client/index.html)
- JavaScript SPA bootstrapped from [`client/scripts/app.js`](../client/scripts/app.js)
- Client-side router swaps page content without full page reloads
- CSS organized in layers: base → layout → components → pages → themes

### Why we need it
Users interact through a graphical interface. The frontend translates clicks and form input into API requests and displays results.

### Alternatives
React, Vue, Svelte, or server-rendered templates (EJS, Pug). OnePage uses **vanilla JavaScript** to keep dependencies minimal and make the learning curve gentler.

### Common mistakes
- Putting secrets (API keys, database passwords) in frontend code — anyone can read it
- Assuming the frontend can talk directly to PostgreSQL — browsers cannot safely hold database credentials

### Interview question
*"What is the difference between frontend and backend?"*  
The frontend runs in the browser and handles UI. The backend runs on a server and handles business logic, authentication, and database access.

### Mini exercise
Open DevTools → Network tab, log in, and find the `POST /api/v1/auth/login` request. What status code did it return?

---

## Backend

### Definition
The **backend** is server-side code that receives HTTP requests, applies business rules, talks to the database, and sends responses.

### How it works in OnePage
- **Express** framework on Node.js
- Entry: [`index.js`](../index.js) runs migrations, then starts [`server/src/server.js`](../server/src/server.js)
- App configuration: [`server/src/app.js`](../server/src/app.js)
- Layered structure: Routes → Controllers → Services → Repositories → Prisma

### Why we need it
Browsers cannot securely store database credentials or hash passwords. The backend is the trusted middle layer.

---

## Database

### Definition
A **database** is organized, persistent storage for structured data — users, pages, widgets, messages.

### How it works in OnePage
- **PostgreSQL** — relational database (tables with rows and relationships)
- **Prisma** — ORM (Object-Relational Mapping) that lets us write JavaScript instead of raw SQL
- Schema: [`server/prisma/schema.prisma`](../server/prisma/schema.prisma)

### Why PostgreSQL (not SQLite)
PostgreSQL handles concurrent users, scales for production hosting (Render), and supports advanced features. The project migrated from SQLite to PostgreSQL for production readiness.

---

## Browser

### Definition
The **browser** (Chrome, Firefox, Safari, Edge) runs HTML/CSS/JS, makes HTTP requests, stores cookies, and renders the DOM.

### How OnePage uses it
- Fetches [`client/index.html`](../client/index.html) and JavaScript modules
- Stores JWT in an **httpOnly cookie** (JavaScript cannot read it — security feature)
- Uses History API for client-side routing (`/dashboard`, `/builder`, etc.)

---

## HTTP

### Definition
**HTTP** (HyperText Transfer Protocol) is the language browsers and servers use to communicate. A **request** goes from client to server; a **response** comes back.

### Request parts
- **Method** — GET (read), POST (create), PUT (update), DELETE (remove)
- **URL** — e.g. `/api/v1/pages/my`
- **Headers** — metadata (Content-Type, Cookie, Authorization)
- **Body** — data sent with POST/PUT (usually JSON)

### Response parts
- **Status code** — 200 OK, 401 Unauthorized, 404 Not Found, 500 Server Error
- **Headers** — Set-Cookie, Content-Type
- **Body** — JSON data

```mermaid
sequenceDiagram
  participant Browser
  participant Express
  participant DB as PostgreSQL

  Browser->>Express: GET /api/v1/pages/my + Cookie jwt
  Express->>Express: Verify JWT
  Express->>DB: Query page + widgets
  DB-->>Express: Rows
  Express-->>Browser: 200 JSON page data
```

---

## Express

### Definition
**Express** is a minimal web framework for Node.js. It handles routing, middleware, and HTTP responses.

### How OnePage uses Express
From [`server/src/app.js`](../server/src/app.js):

```javascript
app.use(helmet());           // Security headers
app.use(cors({ credentials: true }));  // Cross-origin with cookies
app.use('/api', limiter);    // Rate limiting
app.use(express.json());     // Parse JSON bodies
app.use(cookieParser());     // Read cookies
app.use('/api/v1/auth', authRoutes);  // Mount route modules
```

### Middleware chain
Each `app.use()` runs in order. Request flows through security → parsing → routes → error handler.

---

## Prisma

### Definition
**Prisma** is an ORM — a tool that maps database tables to JavaScript objects and generates type-safe queries.

### How OnePage uses it
- Schema defines models (User, Page, Widget, etc.)
- `prisma migrate deploy` applies schema changes in production ([`index.js`](../index.js))
- Repositories call `prisma.user.findUnique()`, `prisma.page.update()`, etc.

### Why Prisma
- Safer than raw SQL (parameterized queries prevent SQL injection)
- Migrations track schema history
- Readable JavaScript API for beginners

### Alternatives
Raw SQL, Knex, Sequelize, Drizzle, TypeORM.

---

## PostgreSQL

### Definition
**PostgreSQL** is an open-source **relational database**. Data lives in **tables** connected by **foreign keys**.

### Connection
The server connects via `DATABASE_URL` environment variable:

```
postgresql://user:password@host:5432/onepage
```

---

## Cloudinary

### Definition
**Cloudinary** is a cloud service for storing and serving images (a **CDN** for media).

### How OnePage uses it
When `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` are set, uploaded images go to Cloudinary. Otherwise, files save locally in `server/uploads/`.

### Why optional
Local storage works for development. Cloudinary scales for production without filling server disk space.

---

## JWT (JSON Web Token)

### Definition
A **JWT** is a signed string that proves a user is authenticated. It contains a payload (user id, role) and a cryptographic signature.

### How OnePage uses it
1. User logs in → server creates JWT with `{ id, role }`
2. Server sets `jwt` cookie (httpOnly, 7-day expiry)
3. Protected routes read cookie → verify signature → load user

Config: [`server/src/config/jwt.js`](../server/src/config/jwt.js)

### Why JWT
Stateless authentication — server does not need to store session data in memory. The token itself carries identity (verified by secret).

### Alternatives
Server-side sessions (Redis), OAuth (Google/GitHub login).

---

## Cookies

### Definition
**Cookies** are small pieces of data the server sends to the browser, which sends them back on subsequent requests.

### OnePage cookie settings
- Name: `jwt`
- `httpOnly: true` — JavaScript cannot access (prevents XSS token theft)
- `sameSite: 'strict'` — only sent to same site (CSRF mitigation)
- `secure: true` in production — only sent over HTTPS

---

## Authentication vs Authorization

| Term | Meaning | OnePage example |
|------|---------|-----------------|
| **Authentication** | Who are you? | Login with email/password → JWT cookie |
| **Authorization** | What can you do? | `requireAdmin` blocks non-admin users from `/admin` |

---

## How Everything Communicates

### Development topology

```mermaid
flowchart LR
  Browser["Browser :5173"]
  Vite[Vite Dev Server]
  Express["Express :3000"]
  DB[(PostgreSQL)]

  Browser --> Vite
  Vite -->|proxy /api| Express
  Express --> DB
```

Vite serves frontend files and proxies `/api`, `/uploads`, `/logo` to Express.

### Production topology

```mermaid
flowchart LR
  Browser[Browser]
  Express["Express :3000"]
  DB[(PostgreSQL)]
  Cloud[Cloudinary]

  Browser --> Express
  Express -->|API + static SPA| Browser
  Express --> DB
  Express --> Cloud
```

One process: [`npm start`](../index.js) → migrations → Express serves API + built SPA from `client/dist`.

### Auth cookie flow

```mermaid
sequenceDiagram
  participant B as Browser
  participant E as Express
  participant D as Database

  B->>E: POST /auth/login email password
  E->>D: Find user compare password
  D-->>E: User record
  E->>E: Sign JWT
  E-->>B: 200 + Set-Cookie jwt
  B->>E: GET /pages/my + Cookie
  E->>E: Verify JWT load user
  E->>D: Fetch page
  E-->>B: 200 page JSON
```

---

## Standard API Response Shape

All API responses follow this format from [`server/src/utils/response.js`](../server/src/utils/response.js):

```json
{
  "success": true,
  "message": "Page retrieved",
  "data": { },
  "errors": null
}
```

The frontend HTTP client in [`client/scripts/api/http.js`](../client/scripts/api/http.js) expects this shape and sends `credentials: 'include'` so cookies are attached.

---

## Honest Architecture Notes

Teaching moments from the real codebase:

1. **Layered pattern is partial** — `uploadController`, `aiController`, `exportController`, and `adminController` skip the service layer. Acceptable for small features; larger apps would add services.
2. **Unused Prisma models** — `Project`, `Skill`, `SocialLink`, `GalleryImage`, `Theme` exist in schema but widget data lives in `Widget.data` JSON today.
3. **No SSR** — pages render client-side. First paint loads empty shell, then JavaScript fetches data. (Hydration — applying server HTML on the client — is not used here.)

---

## Key Takeaways

- **Frontend** = browser UI; **backend** = Express server; **database** = PostgreSQL via Prisma
- **HTTP** carries requests/responses; **JWT cookies** handle authentication
- Dev uses two servers (Vite + Express); production uses one
- Optional Cloudinary, OpenAI, and SMTP enhance features without being required

---

## Mini Exercise

Draw on paper: Browser → Vite → Express → Prisma → PostgreSQL. Label what happens when you click "Save" in the builder.
