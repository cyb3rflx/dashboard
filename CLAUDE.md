# CLAUDE.md

Anweisungen und Projektinfos für Claude in diesem Projekt.

## Projekt

Ein Dashboard, in dem sich Nutzer registrieren, einloggen und ihre eigenen
**Items** verwalten (ansehen, anlegen, bearbeiten, löschen).

- **Backend:** FastAPI + SQLModel, Auth über JWT (PyJWT), ASGI via uvicorn.
- **Frontend:** React 19 + TypeScript, Build mit Vite.
- **Seiten:** Registrierung, Login, Dashboard (Dashboard nur mit Login).

## Architektur

- Entkoppelte SPA (Frontend) + zustandslose REST-API (Backend), JSON über HTTP.
- Auth ist **zustandslos per JWT** (`Authorization: Bearer <token>`), keine
  Server-Sessions.
- DB: SQLite in der Entwicklung, später Postgres (via SQLModel/SQLAlchemy).

## Commands
- Backend-Tests: `uv run pytest`
- Backend-Dev: `uv run uvicorn app.main:app --reload --port 8000`
- Frontend-Build/Typecheck: `npm run build`
- Frontend-Dev: `npm run dev`
(Vollständiges Setup + Env-Variablen: siehe README)

## Datenmodell

- **User**: `id`, `email` (unique), `password_hash`, `created_at`.
- **Item**: `id`, `owner_id` (FK → User), `title`, `description?`,
  `created_at`, `updated_at`.
- 1:N (ein User hat viele Items). **Ownership wird immer serverseitig erzwungen** –
  jede Item-Abfrage ist auf `owner_id == current_user.id` eingeschränkt. Dem
  Client wird dabei nichts geglaubt.

## API (geplant)

| Methode | Pfad             | Auth | Zweck                          |
| ------- | ---------------- | ---- | ------------------------------ |
| POST    | `/auth/register` | Nein | Konto anlegen                  |
| POST    | `/auth/login`    | Nein | Einloggen, JWT zurückgeben     |
| GET     | `/auth/me`       | Ja   | Aktuellen User zurückgeben     |
| GET     | `/items`         | Ja   | Eigene Items auflisten         |
| POST    | `/items`         | Ja   | Item anlegen                   |
| GET     | `/items/{id}`    | Ja   | Ein eigenes Item lesen         |
| PUT     | `/items/{id}`    | Ja   | Ein eigenes Item ändern        |
| DELETE  | `/items/{id}`    | Ja   | Ein eigenes Item löschen       |

## Nicht im Scope

Sharing/Kollaboration, Rollen über "Owner" hinaus, Passwort-Reset/Social-Login/2FA,
Datei-Uploads.

## Konventionen

- Python-Umgebung und Abhängigkeiten immer mit **`uv`** verwalten (kein `pip`).
- Dependencies einzeln angeben (`fastapi` + `uvicorn[standard]`), nicht `fastapi[standard]`.
- Setup, Startbefehle und Umgebungsvariablen stehen in der **README** – dort
  nachschlagen bzw. dort pflegen, statt sie hier zu duplizieren.

## Lernmodus (wichtig)

Florian möchte mit diesem Projekt **FastAPI und React lernen**.

- **Schreibe keinen fertigen Code.** Gib keine kompletten Lösungen vor.
- Florian schreibt den Code **selbst**, damit er es lernt.
- Deine Aufgabe: **erklären, anleiten, Hinweise geben** – mit Konzepten,
  Stichworten, Pseudocode, kleinen Syntaxbeispielen oder führenden Fragen.
- Wenn Florian feststeckt, hilf in **kleinen Schritten**, statt die ganze
  Lösung zu zeigen.
- Verrate eine vollständige Lösung nur, wenn Florian **ausdrücklich** darum bittet.

## Kommunikation

- Antworte **immer auf Deutsch**.
- Bei Fragen: **kurz und einfach** antworten.
