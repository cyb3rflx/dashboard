# Dashboard

A dashboard where users register, log in, and manage their own **items**
(view, create, edit, delete).

- **Backend:** FastAPI + SQLModel, auth via JWT (PyJWT), ASGI via uvicorn.
- **Frontend:** React 19 + TypeScript, built with Vite.

Project details (architecture, data model, API, conventions) are in
[CLAUDE.md](CLAUDE.md).

> Learning project to get hands-on with FastAPI and React (TypeScript).

## Current status

The project skeleton is in place; the application logic is not implemented yet.

- **Backend:** Dependencies and entrypoint (`app.main:app`) configured in
  `pyproject.toml`. The `backend/app/` package is still empty.
- **Frontend:** Vite scaffold with React 19 + TypeScript (`App.tsx`, `main.tsx`).
  Pages (Registration, Login, Dashboard) are not built yet.

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
- Note: only runs once `app/main.py` provides a FastAPI app.

## Run the frontend

```bash
cd frontend
npm install
npm run dev                   # Vite dev server, http://localhost:5173
```

## Environment variables (backend)

| Variable         | Purpose                              | Example                     |
| ---------------- | ------------------------------------ | --------------------------- |
| `DATABASE_URL`   | DB connection (SQLModel)             | `sqlite:///./dashboard.db`  |
| `JWT_SECRET`     | Secret for signing JWTs              | `change-me-in-production`   |
| `JWT_EXPIRE_MIN` | Token lifetime in minutes            | `60`                        |
| `CORS_ORIGINS`   | Allowed frontend origin(s)           | `http://localhost:5173`     |
