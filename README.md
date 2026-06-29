# OnePage

A personal website builder for developers and creators. Build a one-page portfolio with a visual editor, choose a theme, and share your public link.

## Tech Stack

- **Frontend:** Vanilla JavaScript SPA, Vite, CSS custom properties
- **Backend:** Node.js, Express, Prisma
- **Database:** SQLite
- **Auth:** JWT (httpOnly cookies), bcrypt

## Features

- User registration and login
- **Onboarding wizard** — 4-step setup after signup (name, URL, theme, preview) with a ready-made page
- Visual page builder with 9 widget types (Hero, About, Projects, Skills, Gallery, Social, Contact, Resume, Divider)
- Save and load widgets from the database
- Theme picker (6 themes)
- Public profile pages at `/p/your-slug`
- Basic analytics (page views)
- Export site as ZIP
- Admin panel (for admin users)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set at least:

```
JWT_SECRET=your-random-secret-here
CLIENT_URL=http://localhost:5173
```

### 3. Set up database

```bash
cd server
npx prisma migrate dev
cd ..
```

### 4. Run development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### 5. Production

```bash
npm start
```

Serves the app from Express on port 3000.

## Onboarding Flow

New users are guided through a 4-step wizard after registration:

1. **About you** — name and job title
2. **Your link** — choose a public URL slug (`/p/your-name`)
3. **Pick a theme** — select from 6 themes
4. **Preview & launch** — review your page, then go to Dashboard or Builder

On completion, the app seeds 6 starter widgets (Hero, About, Skills, Projects, Social, Contact) personalized with your info. You can edit everything later in the Builder.

## Project Structure

```
onepage/
├── client/          # Frontend SPA
│   ├── scripts/     # Pages, widgets, API client
│   └── styles/      # CSS (base, components, themes)
└── server/          # Express API
    ├── prisma/      # Schema and migrations
    └── src/         # Routes, controllers, services
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/pages/my` | Get your page + widgets |
| PUT | `/api/v1/pages/my/widgets` | Save widgets |
| GET | `/api/v1/pages/:slug` | Public page |
| GET | `/api/v1/analytics/my` | Your analytics |

## Creating an Admin User

After registering, update the user role in the database:

```bash
cd server
npx prisma studio
```

Set `role` to `admin` for your user.

## Author

Muamel Tahsin

## License

MIT
