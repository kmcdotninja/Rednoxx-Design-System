# Rednoxx EHR

A self-hosted Electronic Health Record system for Nigerian primary and secondary facilities — packaged as a single Docker image, deployable on a modest on-premise server, and updatable over a local network or USB bundle.

## Architecture overview

| Layer | Technology |
|---|---|
| API | Laravel 11 + Octane (Swoole) |
| Frontend | React 18 + Vite + TypeScript |
| Database | PostgreSQL 16 (PgBouncer in prod) |
| Cache / Queue | Redis 7 |
| Object storage | MinIO (S3-compatible) |
| Runtime | Single Docker image (nginx + Octane) |

## Quick start (dev)

```bash
cp .env.example .env
# Fill in APP_KEY — or run `php artisan key:generate` inside the container first

make up         # start all containers
make migrate    # run migrations
make seed       # load demo data
```

Everything is served through a single nginx entrypoint, path-routed. The port defaults to `9001` — override it by setting `NGINX_PORT` in your `.env` if it collides with something else on your machine:

- Frontend (HMR): http://localhost:9001/
- API: http://localhost:9001/api/
- FHIR server: http://localhost:9001/fhir/ (and http://localhost:9001/oauth2/ for the [backend auth flow](docs/docs/architecture/part-9-developer-playbooks.md))
- Docs (architecture & playbooks): http://localhost:9001/docs/
- Mailpit: http://localhost:9001/mail/

The FHIR server is also still reachable directly on its own port, http://localhost:8103 — kept so Medplum's self-referential resource URLs (`Bundle.entry.fullUrl`, `Location` headers, pagination links, all generated from its own `baseUrl` config) stay valid regardless of which path a client used to reach it. The nginx route forwards unmodified, so both origins return byte-identical responses.

MinIO's console is exposed on its own port too — it's a single-page app with root-absolute asset paths that doesn't work reliably behind a path prefix:

- MinIO console: http://localhost:9005

Postgres and Redis (both the app's and Medplum's) are internal-only — reachable from other containers on the docker network, not from the host. Use `docker compose exec postgres psql -U ehr` (or the `postgres-medplum` equivalent) to get a shell.

### Running multiple checkouts at once (e.g. dev + staging)

Give each checkout's `.env` a distinct `COMPOSE_PROJECT_NAME` — it namespaces container names, the docker network, and named volumes, so two stacks running side by side can't collide or share a database. Then set distinct `NGINX_PORT`, `MINIO_API_PORT`, `MINIO_CONSOLE_PORT`, and `MEDPLUM_PORT` values in each, since host ports aren't namespaced by the project name and both stacks binding the same one will fail. Postgres/Redis need no such treatment — they're internal-only, so two stacks never fight over their ports.

## Common tasks

```bash
make test       # backend (Pest) + frontend (Vitest)
make lint       # Pint + PHPStan + ESLint + tsc
make fix        # auto-fix formatting issues
make shell      # bash into the app container
make logs       # tail app + worker logs
```

## Module map

```
Patients       → demographics, allergies, history
Consultations  → notes, vitals, diagnoses (ICD-10), referrals
Pharmacy       → formulary, dispensing, stock
Billing        → invoices, payments, NHIA claims
Queue          → OPD queue management
```

## Docs

- [Architecture & Design](docs/architecture-and-design.md)
- [API Reference](docs/api/openapi.yaml)
- [Setup Guide](docs/SETUP.md)
- [Update runbook](docs/runbooks/update.md)
- [Rollback runbook](docs/runbooks/rollback.md)
- [Backup & Restore](docs/runbooks/backup-restore.md)
