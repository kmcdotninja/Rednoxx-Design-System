# Runbook: First-Time Deploy

For applying an update to an already-deployed site, see [update.md](update.md) instead.
This runbook is for bringing a brand-new dev/staging/production instance up from nothing.

## What it does

`deploy/scripts/deploy.sh <dev|staging|production>` brings up the entire stack — app,
Postgres, Redis, MinIO, and MedPlum (FHIR server) with its own Postgres/Redis — then:

```
build (or pull) images
  ↓
docker compose up -d
  ↓
wait for postgres / redis / medplum-server healthchecks
  ↓
php artisan migrate --force
  ↓
seed roles & permissions, seed the admin user
  ↓
php artisan medplum:bootstrap
  (creates MedPlum's own super-admin account if this is a fresh MedPlum instance,
   then this app's FHIR client credentials)
  ↓
poll /api/health until it answers
```

It's safe to re-run: migrations are `--force` (incremental), seeders are idempotent,
and `medplum:bootstrap` no-ops once this app's FHIR client credentials already exist.

## Prerequisites

1. Host provisioned — see `deploy/scripts/install.sh` (Docker installed, RAM/disk checked).
2. A checkout of this repo on the target host (`git clone` into e.g. `/opt/rednoxx-ehr`).
   `deploy.sh` currently builds the image on the target, so the full source needs to be
   there — once a registry/bundle pipeline exists, this moves to a pull-only, no-checkout flow.
3. `.env` in the repo root, copied from `.env.example` and configured for the target
   environment. For anything other than `dev`, the script refuses to proceed unless:
   - `APP_ENV` is set to something other than `local`
   - `APP_KEY`, `DB_PASSWORD`, `ADMIN_PASSWORD` are all set
   - `MEDPLUM_PASSWORD` is set to something other than the local-dev default

## Running it

```bash
cd /opt/rednoxx-ehr   # your checkout
./deploy/scripts/deploy.sh dev            # local-parity dev stack (docker-compose.yml)
./deploy/scripts/deploy.sh staging        # deploy/compose/docker-compose.prod.yml
./deploy/scripts/deploy.sh production     # same compose file, prompts for confirmation
```

Flags:

- `--skip-build` — `docker compose pull` instead of `build` (for once a registry exists).
- `--yes` — skip the production confirmation prompt (for CI).

## Verifying success

```bash
curl -s http://localhost/api/health | jq .
# Expected: {"status":"ok"}

docker compose -f deploy/compose/docker-compose.prod.yml ps
# app, postgres, redis, minio, medplum-server, postgres-medplum, redis-medplum
# should all show "healthy" or "running"
```

Confirm the admin account works:

```bash
curl -s -X POST http://localhost/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"'"$ADMIN_EMAIL"'","password":"'"$ADMIN_PASSWORD"'"}'
```

## If MedPlum bootstrap fails

`medplum:bootstrap` is the step most likely to fail on a first deploy — it's talking to
a brand-new MedPlum instance that has no users at all yet. Check:

```bash
docker compose logs medplum-server
docker compose exec app php artisan medplum:bootstrap   # re-run directly for full output
```

It's idempotent, so re-running after fixing the underlying issue (usually MedPlum not
being healthy yet, or `MEDPLUM_EMAIL`/`MEDPLUM_PASSWORD` mismatched from a previous
partial run) is safe.
