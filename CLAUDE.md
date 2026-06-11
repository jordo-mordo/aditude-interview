# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (copies example.env → .env, installs deps, generates Prisma client)
npm run setup

# Dev server on :3000
npm run dev

# Lint
npm run lint

# Database
npm run db:push       # push schema changes to SQLite without migrations
npm run db:seed       # run prisma/seed.ts
npm run db:reset      # reset DB and re-seed (destructive)
npm run db:studio     # open Prisma Studio GUI
```

No test runner is configured in this scaffold.

## Architecture

**Next.js 14 App Router** — all routes live under `src/app/`. The root layout (`src/app/layout.tsx`) wraps everything in a `max-w-4xl` centered container; new pages should be added as directories with `page.tsx` files under `src/app/`.

**Database** — Prisma ORM with SQLite (`DATABASE_URL=file:./dev.db`). The schema file belongs at `prisma/schema.prisma` and the seed script at `prisma/seed.ts` (run with `tsx`). Neither exists yet — they are part of the interview tasks.

**Key domain models to implement:**
- `Organization` — top-level tenant
- `Publisher` — belongs to an organization
- `User` — system-level role (`USER` | `ADMIN`); joined to organizations via a membership join table that carries an org-level role; joined to publishers via a separate join table that carries publisher-level permissions

**`bcryptjs`** is installed for password hashing if user authentication is added.

**Styling** — Tailwind CSS; no component library is installed.

## Rules
this project is designed for an interview, so make sure every decision that is made is explained from a high-level in order to justify choices later on to an interviewer.
be hesitant to make assumptions and rely on me to make any important decisions beyond best practices and standard syntax.
