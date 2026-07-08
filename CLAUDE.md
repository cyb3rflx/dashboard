# CLAUDE.md

Instructions and project info for Claude in this project.

## Project

A dashboard where users register, log in, and manage their own **items**
(view, create, edit, delete).

- **Backend:** FastAPI + SQLModel, auth via JWT (PyJWT), ASGI via uvicorn.
- **Frontend:** React 19 + TypeScript, built with Vite. Styling with
  **Tailwind CSS**, UI components via **shadcn/ui**.
- **Pages:** Registration, Login, Dashboard (Dashboard requires login).

## Architecture

- Decoupled SPA (frontend) + stateless REST API (backend), JSON over HTTP.
- Auth is **stateless via JWT** stored in an **httpOnly cookie**
  (`access_token`), no server sessions. The cookie is set/cleared by the
  backend on login/logout (`samesite=lax`; `secure=True` in production).
  Frontend requests must use `credentials: "include"`; CORS is configured
  with `allow_credentials=True` and explicit origins (no `*`).
- Frontend API calls go through a small fetch wrapper
  (`frontend/src/api/client.ts`) that sends credentials and redirects to
  `/login` on 401. Exception: the login request uses plain `fetch`, since a
  401 there means "wrong credentials", not "session expired".
- DB: SQLite in development, Postgres later (via SQLModel/SQLAlchemy).

## Commands

- Backend tests: `uv run pytest`
- Backend dev: `uv run uvicorn app.main:app --reload --port 8000`
- Frontend build/typecheck: `npm run build`
- Frontend dev: `npm run dev`

(Full setup + env variables: see README.)

## Data model

- **User**: `id` (UUID), `email` (unique), `username` (unique),
  `password_hash`, `created_at`.
- **Item**: `id` (UUID), `owner_id` (FK → User), `title`, `description?`,
  `created_at`, `updated_at`.
- All primary keys are **UUIDs**, generated server-side (`uuid4`).
- 1:N (one user has many items). **Ownership is always enforced server-side** –
  every item query is scoped to `owner_id == current_user.id`. The client is
  never trusted for this.

## API (planned)

| Method | Path             | Auth | Purpose                       |
| ------ | ---------------- | ---- | ----------------------------- |
| POST   | `/auth/register` | No   | Create an account             |
| POST   | `/auth/login`    | No   | Log in, set JWT cookie        |
| POST   | `/auth/logout`   | Yes  | Log out, clear JWT cookie     |
| GET    | `/auth/me`       | Yes  | Return the current user       |
| GET    | `/items`         | Yes  | List own items                |
| POST   | `/items`         | Yes  | Create an item                |
| GET    | `/items/{id}`    | Yes  | Read one own item             |
| PUT    | `/items/{id}`    | Yes  | Update one own item           |
| DELETE | `/items/{id}`    | Yes  | Delete one own item           |

## Out of scope

Sharing/collaboration, roles beyond "owner", password reset/social login/2FA,
file uploads.

## Conventions

- Always manage the Python environment and dependencies with **`uv`** (no `pip`).
- List dependencies individually (`fastapi` + `uvicorn[standard]`), not
  `fastapi[standard]`.
- Setup, start commands, and env variables live in the **README** – look them
  up / maintain them there instead of duplicating them here.
- **Styling:** use **Tailwind** utility classes; no separate CSS files unless
  really needed. Prefer **shadcn/ui** components before building custom ones.
  shadcn components are copied into the repo (e.g. `components/ui/`) and may be
  edited directly.

## Learning mode (important)

Florian is using this project to **learn FastAPI and React**.

- **Do not write finished code.** Do not hand over complete solutions.
- Florian writes the code **himself** so that he learns it.
- Your job: **explain, guide, give hints** – with concepts, keywords,
  pseudocode, small syntax examples, or leading questions.
- When Florian is stuck, help in **small steps** instead of showing the whole
  solution.
- Only reveal a full solution if Florian **explicitly** asks for it.

## Communication

- Florian communicates with you in **German** – always reply in **German**.
- For questions: answer **short and simple**.
