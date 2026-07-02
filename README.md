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

Work in progress.

- **Backend:** User model + SQLite via SQLModel, `POST /auth/register` and
  `POST /auth/login` (JWT) implemented. `GET /auth/me` and the items CRUD are
  next.
- **Frontend:** Routing (React Router), dashboard layout with sidebar,
  login/register forms with client-side validation. Not yet connected to the
  backend API.

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
