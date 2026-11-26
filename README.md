# Task Manager

A task and project management app with a Next.js frontend and a Fastify API. PostgreSQL stores users, projects, project memberships, and tasks; Drizzle ORM defines the schema and applies database migrations.

## Repository layout

```text
fe/       Next.js frontend (http://localhost:3000)
server/   Fastify API and Drizzle migrations (http://localhost:3020)
```

## Requirements

- Node.js 24.3 or later (required by the backend)
- pnpm and Corepack
- PostgreSQL, running locally or reachable over the network

Each package declares its own pnpm version in `package.json` (`server`: pnpm 12.21.0; `fe`: pnpm 8.10.0). Run Corepack/pnpm commands from the package directory so the package manager can use that package's declaration.

## Environment files

Environment files are ignored by Git so credentials and local settings are not committed. Both packages include a tracked `.env.example` template. Copy each template to the ignored local filename, then edit its values:

```sh
cd server
cp .env.example .env
```

```sh
cd fe
cp .env.example .env.local
```

On Windows PowerShell, use `Copy-Item .env.example .env` (in `server`) and `Copy-Item .env.example .env.local` (in `fe`).

Backend `server/.env`:

| Variable | Purpose |
| --- | --- |
| `DB_URL` | PostgreSQL connection URL, including the database name. Used by the API, migrations, and database scripts. |
| `JWT_SECRET` | Secret used to sign and verify login tokens. Use a long, random value. |
| `PORT` | API port; use `3020` for the local frontend configuration. |
| `LOG_LEVEL` | Optional Pino log level, such as `info` or `debug`. |
| `ADMIN_PASSWORD` | Optional override for the initial admin seed password. Defaults to `admin`. |

Frontend `fe/.env.local`:

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Must exactly match `server/.env` so Next.js middleware can verify the API's auth cookie. |

The frontend currently sends API requests to the hard-coded URL `http://localhost:3020` in `fe/lib/api.ts`, and the API allows credentialed CORS from `http://localhost:3000`. For a different local setup or deployment, update those origins/URLs in the code and configure both sides consistently.

## First-time setup

1. Start PostgreSQL and create both local env files as described above. Set `DB_URL` to the database you want the app to use. For example: `postgresql://postgres:postgres@localhost:5432/task_manager`. The database creation script connects to PostgreSQL's `postgres` maintenance database, so the URL credentials need permission to create databases.
2. Install backend dependencies and create the database, apply migrations, and seed the initial admin:

   ```sh
   cd server
   pnpm install
   pnpm db:setup
   ```

   `db:setup` runs `db:create`, `migration:apply`, and `db:seed:admin` in that order. It is safe to rerun: database creation skips an existing database and admin seeding skips an existing `admin@mail.com` account. Migrations are managed by Drizzle and recorded in the database.

3. Install frontend dependencies:

   ```sh
   cd fe
   pnpm install
   ```

4. Start the API and frontend in separate terminals:

   ```sh
   cd server
   pnpm dev
   ```

   ```sh
   cd fe
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and sign in with:

   - Email: `admin@mail.com`
   - Password: `admin`

   `ADMIN_PASSWORD` in `server/.env` can override the seed password; it defaults to `admin`. The seed script stores an Argon2 hash, never the plaintext password. This starter credential is for local setup; choose a private password before using the app beyond local development. If `admin@mail.com` already exists, the script leaves that account's current role and password unchanged.

## Backend commands

Run these from `server/`:

| Command | Action |
| --- | --- |
| `pnpm dev` | Run the API in development with Nodemon, watching `src/` and `.env`. |
| `pnpm build` | Remove `dist/` and compile TypeScript into `dist/`. |
| `pnpm start` | Start the compiled API, loading `.env` if present. Build first. |
| `pnpm typecheck` | Type-check the backend without emitting files. |
| `pnpm db:create` | Create the database named by `DB_URL` if it does not exist. |
| `pnpm migration:gen` | Generate a migration from the Drizzle schema changes. Review generated SQL before applying it. |
| `pnpm migration:apply` | Apply pending Drizzle migrations to `DB_URL`. |
| `pnpm db:seed:admin` | Insert the initial admin account if its email is not already present. |
| `pnpm db:setup` | Create the database, apply migrations, then seed the admin. |

When changing the database schema, edit `server/src/schemas/database/schema.ts`, generate a migration with `pnpm migration:gen`, review the generated migration under `server/src/migrations/`, then apply it with `pnpm migration:apply`.

## Frontend commands

Run these from `fe/`:

| Command | Action |
| --- | --- |
| `pnpm dev` | Start the Next.js development server on port 3000. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Serve the production build; run `pnpm build` first. |
| `pnpm lint` | Run ESLint. |

## API overview

The Fastify API listens on port 3020. The current routes include:

| Route | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/sign-in` | Public | Sign in with email/password; sets an HTTP-only `token` cookie. |
| `POST /api/auth/sign-out` | Public | Clear the login cookie. |
| `GET /api/users/list` | Admin | List non-admin users. |
| `POST /api/users/create` | Admin | Create a user. |
| `DELETE /api/users/:id` | Admin | Delete a user. |
| `GET /api/projects/list` | Signed in | List all projects for admins or project memberships for users. |
| `POST /api/projects/create` | Admin | Create a project. |
| `DELETE /api/projects/:id` | Admin | Delete a project. |
| `POST /api/projects/create-member` | Admin | Add a user to a project. |
| `GET /api/projects/details/:projectId` | Signed in | Get project details. |
| `GET /api/tasks/list` | Signed in | List tasks. |
| `GET /api/tasks/:projectId` | Signed in | List a project's tasks. |
| `POST /api/tasks/create` | Signed in | Create a task. |
| `POST /api/tasks/update` | Signed in | Update a task. |
| `DELETE /api/tasks/:id` | Signed in | Delete a task. |

Authentication uses an HTTP-only cookie and role claims (`admin` or `user`). The frontend middleware restricts regular users to project pages and admins can access the admin screens. The `users` table contains a UUID primary key, required name and unique email, role enum defaulting to `user`, Argon2 password hash, and created/updated timestamps.

## Data and migrations

Drizzle schema definitions are in `server/src/schemas/database/schema.ts`; generated, versioned migration files are in `server/src/migrations/`. The schema currently includes:

- `users`: accounts and roles (`admin`, `user`)
- `projects`: projects created by users
- `project_members`: users assigned to projects
- `tasks`: tasks attached to projects, with pending/in-progress/completed status and ordering

Back up the PostgreSQL database before applying migrations to data you care about. Do not commit `.env`, `.env.local`, or other files containing secrets.
