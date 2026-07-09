# Dashboard

A dashboard where users register, log in, and manage their own **items**
(view, create, edit, delete).

- **Backend:** FastAPI + SQLModel, auth via JWT (PyJWT), ASGI via uvicorn.
- **Frontend:** React 19 + TypeScript, built with Vite. Styling with
  Tailwind CSS, UI components via shadcn/ui.

Project details (architecture, data model, API, conventions) are in
[CLAUDE.md](CLAUDE.md).

> Learning project to get hands-on with FastAPI and React (TypeScript).

## Current status

Feature-complete for the learning scope.

- **Backend:** Auth (`register`, `login`, `logout`, `me`) with JWT in an
  httpOnly cookie, items CRUD with owner-scoped access, UUID primary keys,
  SQLite via SQLModel.
- **Frontend:** Login/registration pages, protected dashboard (sidebar,
  current user, logout), items table with create/edit/delete dialogs,
  central API client that redirects to `/login` on 401.

Known limitations (dev setup): cookie is set with `secure=False` (needs
HTTPS/`True` in production), naive local timestamps instead of UTC, no DB
migrations (schema changes require a fresh database).

## Requirements

- Python **>= 3.14** and [`uv`](https://docs.astral.sh/uv/)
- Node.js (LTS) and npm

## Run the backend

```bash
cd backend
uv sync                       # install dependencies
uv run uvicorn app.main:app --reload --port 8000
```

- API docs (Swagger UI): `http://localhost:8000/docs`
- First start requires the `.env` file (see
  [Environment variables](#environment-variables-backend)).

## Run the frontend

```bash
cd frontend
npm install
npm run dev                   # Vite dev server, http://localhost:5173
```

## Environment variables (backend)

The backend reads its configuration from `backend/app/.env` (loaded via
`python-dotenv`). Copy the template and fill in your values:

```bash
cd backend/app
cp .env.example .env
```

| Variable                      | Purpose                   | Example |
| ----------------------------- | ------------------------- | ------- |
| `SECRET_KEY`                  | Secret for signing JWTs   | output of `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALGORITHM`                   | JWT signing algorithm     | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `30`    |
| `DATABASE_URL` (optional)     | DB connection; defaults to SQLite (`backend/data/database.db`, created automatically) | `postgresql+psycopg://user:pass@host:5432/dashboard` |

The frontend knows one **build-time** variable: `VITE_API_URL` (base URL of
the API). Unset in development it falls back to `http://localhost:8000`; in
the production image it is left empty so the app uses relative paths behind
a reverse proxy (same origin).

## Docker

Both apps ship with a Dockerfile. Build and run locally:

```bash
# Backend (secrets are passed at runtime, never baked into the image)
cd backend
docker build -t dashboard-backend .
docker run --rm -p 8000:8000 --env-file app/.env dashboard-backend

# Frontend (multi-stage: Node build → nginx with SPA fallback)
cd frontend
docker build -t dashboard-frontend --build-arg VITE_API_URL=http://localhost:8000 .
docker run --rm -p 5173:80 dashboard-frontend
```

On every push to `main`, GitHub Actions builds both images and pushes them
to the GitHub Container Registry as
`ghcr.io/<owner>/dashboard-backend` and `ghcr.io/<owner>/dashboard-frontend`
(tags: `latest` + commit SHA). See `.github/workflows/docker.yml`.
