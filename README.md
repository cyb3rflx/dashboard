# Dashboard

Ein Dashboard, in dem sich Nutzer registrieren, einloggen und ihre eigenen
**Items** verwalten (ansehen, anlegen, bearbeiten, löschen).

- **Backend:** FastAPI + SQLModel, Auth über JWT (PyJWT), ASGI via uvicorn.
- **Frontend:** React 19 + TypeScript, Build mit Vite.

Projektdetails (Architektur, Datenmodell, API, Konventionen) stehen in
[CLAUDE.md](CLAUDE.md).

## Aktueller Stand

Projekt-Grundgerüst steht, die Anwendungslogik ist noch nicht implementiert.

- **Backend:** Abhängigkeiten und Entrypoint (`app.main:app`) in `pyproject.toml`
  konfiguriert. Das Paket `backend/app/` ist noch leer.
- **Frontend:** Vite-Scaffold mit React 19 + TypeScript (`App.tsx`, `main.tsx`).
  Seiten (Registrierung, Login, Dashboard) sind noch nicht gebaut.

## Voraussetzungen

- Python **>= 3.14** und [`uv`](https://docs.astral.sh/uv/)
- Node.js (LTS) und npm

## Backend starten

```bash
cd backend
uv sync                       # Abhängigkeiten installieren
uv run uvicorn app.main:app --reload --port 8000
```

- API-Doku (Swagger UI): `http://localhost:8000/docs`
- Hinweis: läuft erst, sobald `app/main.py` mit einer FastAPI-App existiert.

## Frontend starten

```bash
cd frontend
npm install
npm run dev                   # Vite-Dev-Server, http://localhost:5173
```

## Umgebungsvariablen (Backend)

| Variable         | Zweck                                | Beispiel                    |
| ---------------- | ------------------------------------ | --------------------------- |
| `DATABASE_URL`   | DB-Verbindung (SQLModel)             | `sqlite:///./dashboard.db`  |
| `JWT_SECRET`     | Secret zum Signieren der JWTs        | `change-me-in-production`   |
| `JWT_EXPIRE_MIN` | Token-Gültigkeit in Minuten          | `60`                        |
| `CORS_ORIGINS`   | Erlaubte Frontend-Origin(s)          | `http://localhost:5173`     |

