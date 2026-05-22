# Healify Microservices — Agent Guide

## Project structure

3 microservices under `services/`, each with its own PostgreSQL DB + Sequelize ORM.

| Service | Port | DB port (Docker) | Internal HTTP targets |
|---------|------|------------------|-----------------------|
| `doctor-service` | 4001 | 5432 | — |
| `patient-service` | 4002 | 5433 | — |
| `appointment-service` | 4003 | 5434 | `doctor-service:4001`, `patient-service:4002` |

## How to run

**Docker (recommended):** `docker-compose up -d --build` from repo root.  
**Local dev:** For each service, `cp .env.example .env`, `npm install`, then `npm start` or `npm run dev` (nodemon).  
Stop: `docker-compose down -v` (the `-v` drops DB volumes).

Each service entrypoint is `src/app.js`. All services call `sequelize.sync()` on startup — no migration step needed.

## Key code conventions

- **CommonJS** modules throughout (no ESM).
- Every service shares the same layered structure: `config/` → `domain/entities/` → `services/` → `controllers/` → `routes/` → `middleware/` → `validators/`.
- Sequelize models defined in `domain/entities/`, associations in `domain/index.js`.
- Routes are grouped under `/api` in each service. Route files use `const { Router } = require('express')`.
- Models use UUID primary keys (`DataTypes.UUIDV4`), `snake_case` for `field` names.
- Validation uses `express-validator` arrays + a `validate` middleware wrapper.
- Error handling: a single `errorHandler` middleware catches Sequelize errors and returns JSON.

## Inter-service communication

`appointment-service` calls `doctor-service` and `patient-service` via **axios** (configured in `src/services/serviceClients.js`, 5s timeout).  
Service URLs swap between Docker hostnames and `localhost` depending on env.

## Testing

No test framework or test files exist. Root `package.json` has a placeholder `"test": "echo \\"Error: no test specified\\" && exit 1"`.

## DB notes

- Migrations dirs and seeders dirs exist but are empty. Schema is managed via Sequelize model `sync()` at startup.
- `.sequelizerc` is present but unused (models-path points to `domain/entities/`).
- `appointment-service` does DB-level conflict check on create (no duplicate non-cancelled slots per doctor/date/time).

## Auth

All services use JWT auth (`jsonwebtoken` + `bcrypt`). `patient-service` issues tokens; `doctor-service` and `appointment-service` validate them with the same `JWT_SECRET`. Protected routes use `middleware/auth.js` (Bearer token). Mutating endpoints in all services require auth.

## Stack

Node.js 18 + Express 4 + Sequelize 6 + pg 8 + PostgreSQL 15 (alpine). `appointment-service` additionally uses axios. All services use `dotenv`, `cors`, `express-validator`, `uuid`.

## OpenCode Skills

- **`nodejs-backend-patterns`** — Node.js/Express patterns for this codebase
- **`ui-ux-pro-max`** — Design intelligence (50+ styles, 161 color palettes, 99 UX guidelines)

Run `npx skills find <query>` to search for new skills.

## Frontend plan

See `docs/02-frontend-vue3.md` for the full Vue 3 MVP plan with design system specs (colors, typography, spacing, components, accessibility). Each component covers all states: loading, empty, error, data.

## What's not here

- No CI workflows
- No lint/format/typecheck config
- No codegen or build step
