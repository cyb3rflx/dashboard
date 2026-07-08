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
migrations (schema changes require deleting `database.db`).

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

The SQLite database file (`database.db`) is created automatically on first
start; no configuration needed.
