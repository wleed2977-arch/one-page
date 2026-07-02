# OnePage — Educational Documentation

Welcome to the complete course for understanding the **OnePage** full-stack application.

This documentation is written for students who have learned **HTML, CSS, JavaScript, Node.js, and Express basics** — but have never built a real full-stack project before. Every concept is explained from scratch.

---

## How to Use This Course

1. Read the chapters **in order** the first time through.
2. Each chapter links to related chapters and source files in the repository.
3. Major concepts follow a consistent teaching format: definition, analogy, how it works, why we need it, how OnePage uses it, alternatives, mistakes, interview questions, summary, and a mini exercise.
4. Use the [Glossary](14_GLOSSARY.md) when you encounter an unfamiliar term.
5. Use the [FAQ](13_FAQ.md) when you have a specific "why?" question.

---

## Reading Order

| # | Chapter | What You Will Learn |
|---|---------|---------------------|
| 00 | [Project Overview](00_PROJECT_OVERVIEW.md) | What OnePage is, who it is for, and how users experience it |
| 01 | [Full Architecture Guide](01_FULL_ARCHITECTURE_GUIDE.md) | How frontend, backend, database, and services connect |
| 02 | [Folder Structure Guide](02_FOLDER_STRUCTURE_GUIDE.md) | What every folder and file is for |
| 03 | [Frontend Guide](03_FRONTEND_GUIDE.md) | SPA routing, widgets, builder, CSS themes, API client |
| 04 | [Backend Guide](04_BACKEND_GUIDE.md) | Express, routes, controllers, services, middleware |
| 05 | [Database Guide](05_DATABASE_GUIDE.md) | Tables, relationships, Prisma, migrations, JSON widgets |
| 06 | [API Guide](06_API_GUIDE.md) | REST, HTTP methods, and every endpoint |
| 07 | [Security Guide](07_SECURITY_GUIDE.md) | Auth, hashing, JWT, cookies, and threat protection |
| 08 | [UI/UX Guide](08_UI_UX_GUIDE.md) | Design system, layout, accessibility, themes |
| 09 | [Complete Project Flow](09_COMPLETE_PROJECT_FLOW.md) | End-to-end journey from signup to public page visit |
| 10 | [Deployment Guide](10_DEPLOYMENT_GUIDE.md) | Hosting, DNS, HTTPS, and deploying to production |
| 11 | [Git Guide](11_GIT_GUIDE.md) | Version control workflow for this project |
| 12 | [Debugging Guide](12_DEBUGGING_GUIDE.md) | How to find and fix problems |
| 13 | [FAQ](13_FAQ.md) | 100+ beginner questions answered |
| 14 | [Glossary](14_GLOSSARY.md) | Dictionary of every technical term |
| 15 | [Next Steps](15_NEXT_STEPS.md) | How to improve the project and what to learn next |

---

## Quick Reference

- **Tech stack:** Vanilla JS SPA (Vite) + Express + PostgreSQL (Prisma) + JWT cookies
- **Dev command:** `npm run dev` (frontend on port 5173, API on port 3000)
- **Production command:** `npm start` (single server on port 3000)
- **Public pages:** `/p/your-slug`
- **API base:** `/api/v1`

---

## Prerequisites

Before starting, you should be comfortable with:

- Writing HTML pages and CSS styles
- JavaScript variables, functions, arrays, objects, and `async/await`
- Basic Node.js and Express route handlers
- Using the terminal to run `npm` commands

You do **not** need prior experience with databases, authentication, or deployment.
