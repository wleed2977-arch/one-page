# 05 — Database Guide

**Audience:** Beginners learning relational databases and Prisma.  
**Prerequisites:** [01 — Full Architecture Guide](01_FULL_ARCHITECTURE_GUIDE.md)  
**What you will learn:** Tables, relationships, Prisma, migrations, and why widget data is stored as JSON.

**Read next:** [06 — API Guide](06_API_GUIDE.md)

---

## What Is a Database?

### Definition
A **database** is persistent storage for structured data. Unlike variables in JavaScript that disappear when the program stops, database data survives server restarts.

### Real-life analogy
A database is like a filing cabinet with labeled drawers (tables), folders (rows), and fields on each form (columns).

### OnePage's database
**PostgreSQL** — a relational database where tables connect through keys.

Connection string in `server/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/onepage
```

---

## Core Concepts

### Table
A **table** stores one type of entity. Example: `User` table holds all user accounts.

### Row (Record)
One **row** is one instance — e.g., one user with email `alice@example.com`.

### Column (Field)
A **column** is one attribute — e.g., `email`, `password`, `createdAt`.

### Primary Key
A **primary key** uniquely identifies each row. OnePage uses UUID strings (`@id @default(uuid())`).

### Foreign Key
A **foreign key** links rows between tables. `Page.userId` references `User.id`.

### Index / Unique Constraint
**`@unique`** ensures no two rows share the same value (e.g., email, slug). Speeds up lookups.

### Cascade Delete
When a parent row is deleted, **cascade** deletes children. Deleting a `User` deletes their `Page`, `Profile`, `Widget`, etc.

---

## Entity-Relationship Diagram

```mermaid
erDiagram
  User ||--o| Profile : has
  User ||--o{ Page : owns
  User ||--o{ Project : has
  User ||--o{ Skill : has
  User ||--o{ SocialLink : has
  User ||--o{ GalleryImage : has
  User ||--o{ Message : receives
  Page ||--o{ Widget : contains
  Page ||--o{ AnalyticsRecord : tracks
  Page }o--o| Theme : uses
  Theme ||--o{ Page : styles

  User {
    string id PK
    string email UK
    string password
    string role
  }

  Page {
    string id PK
    string slug UK
    string title
    string themeName
    string userId FK
  }

  Widget {
    string id PK
    string type
    int order
    boolean visible
    json data
    string pageId FK
  }

  Profile {
    string id PK
    string username UK
    boolean onboardingCompleted
    string userId FK
  }

  AnalyticsRecord {
    string id PK
    string pageId FK
    int views
    datetime date
  }
```

---

## Models in Detail

Schema file: [`server/prisma/schema.prisma`](../server/prisma/schema.prisma)

### User
Central account table.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | String | Unique, used for login |
| password | String | bcrypt hash, never returned to client |
| role | String | `"user"` or `"admin"` |
| name, picture | String? | Optional display fields |

**Relations:** pages, profile, projects, skills, socials, gallery, messages

### Profile
One-to-one with User. Stores public identity info.

| Field | Notes |
|-------|-------|
| username | Unique public handle |
| fullName, jobTitle, bio | Display info |
| onboardingCompleted | Gates access to dashboard |
| avatar, resume | URLs to uploaded files |

### Page
One user can have pages; in practice each user gets one page at registration.

| Field | Notes |
|-------|-------|
| slug | Unique URL segment (`/p/{slug}`) |
| title | Page title |
| themeName | One of six theme IDs |
| userId | Owner |

### Widget
Content blocks on a page.

| Field | Notes |
|-------|-------|
| type | e.g. `hero`, `about`, `projects` |
| order | Display order (0, 1, 2...) |
| visible | Show/hide on public page |
| data | **JSON** — widget-specific content |
| pageId | Parent page |

### AnalyticsRecord
Daily view counts per page.

| Field | Notes |
|-------|-------|
| pageId | Which page |
| views | Count for that day |
| date | Date of the record |

### Message
Contact form submissions.

| Field | Notes |
|-------|-------|
| name, email, content | Visitor's message |
| userId | Page owner who receives it |
| isRead | Owner has seen it |

### Unused Models (Schema vs Reality)

These models exist in the schema but are **not used by current application code**:

- `Project`, `Skill`, `SocialLink`, `GalleryImage` — widget content lives in `Widget.data` JSON instead
- `Theme` — pages use `themeName` string; theme CSS is in frontend files

This is a teaching moment: schemas can evolve. The JSON approach was chosen for flexibility; normalized tables remain for future refactoring.

---

## Why JSON Inside Widgets?

### Definition
**JSON** (JavaScript Object Notation) is a text format for structured data. Prisma's `Json` type stores it in PostgreSQL's `jsonb` column.

### Example widget data (Hero)
```json
{
  "headline": "Jane Developer",
  "subtitle": "Full-stack engineer",
  "ctaText": "Contact Me",
  "ctaTarget": "contact"
}
```

### Why we need it
Each widget type has different fields. Hero has `headline`; Projects has an array of `items`. Storing all in one flexible `data` column avoids:

- A separate database table per widget type
- A migration every time a widget gains a new field

### Tradeoffs

| JSON approach | Normalized tables |
|---------------|-------------------|
| Flexible schema per widget | Strict columns, queryable |
| Fast to build MVP | Better for complex reporting |
| Harder to query "all projects across users" | Easier SQL joins |

### How save works
[`pageRepository.saveWidgets`](../server/src/repositories/pageRepository.js) uses a **transaction**:

1. Delete all existing widgets for the page
2. Create new widgets from the submitted array
3. Return updated page with widgets

This "replace all" strategy is simple for beginners. Alternatives: upsert individual widgets by ID.

---

## Prisma

### Definition
**Prisma** is an ORM — maps database tables to JavaScript objects.

### Key files
- `schema.prisma` — model definitions
- `migrations/` — SQL history of schema changes
- Generated `@prisma/client` — query API

### Common operations
```javascript
// Find one user by email
await prisma.user.findUnique({ where: { email } });

// Update profile
await prisma.profile.update({ where: { userId }, data: { fullName } });

// Transaction (all or nothing)
await prisma.$transaction(async (tx) => {
  await tx.widget.deleteMany({ where: { pageId } });
  await tx.widget.createMany({ data: widgets });
});
```

### Client singleton
[`server/src/config/database.js`](../server/src/config/database.js) exports one `PrismaClient` instance reused across requests.

---

## Migrations

### Definition
A **migration** is a versioned change to database structure. Like Git commits for your schema.

### Commands
```bash
cd server
npx prisma migrate dev    # Development: create + apply migration
npx prisma migrate deploy # Production: apply pending migrations only
npx prisma generate       # Regenerate client after schema change
npx prisma studio         # Visual database browser
```

### Production flow
[`index.js`](../index.js) runs `prisma migrate deploy` on startup with retries (important on Render when Postgres may still be waking up).

### Migration folder
`server/prisma/migrations/20260630120000_init_postgres/` contains the initial PostgreSQL schema SQL.

---

## Seed

### Definition
**Seeding** inserts starter data for development or demos.

OnePage does not use a formal `prisma/seed.ts`. Instead, **onboarding** seeds widgets via [`buildStarterWidgets`](../server/src/data/starterTemplate.js) when a user completes the wizard.

---

## Normalization

### Definition
**Normalization** organizes data to reduce duplication. User email appears once in `User`, not copied into every widget.

### OnePage's approach
- **Normalized:** User, Profile, Page, Message, AnalyticsRecord
- **Denormalized:** Widget `data` JSON (embeds projects, skills inline)

This hybrid is common in content-builder apps.

---

## Cascade Delete Example

```prisma
user User @relation(..., onDelete: Cascade)
```

Deleting a user removes their pages, widgets, profile, and messages automatically. Prevents orphaned rows.

---

## Key Takeaways

- PostgreSQL stores users, pages, widgets, analytics, and messages
- Prisma provides a JavaScript API and migration system
- Widget content uses JSON for flexibility; some schema models are reserved for future use
- Widget saves use a transaction: delete all, recreate all

---

## Mini Exercise

1. Run `cd server && npx prisma studio`
2. Find your test user's Page and Widget rows
3. Identify which data is in columns vs inside the `data` JSON field
