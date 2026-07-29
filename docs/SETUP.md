# Setup Guide

## Prerequisites

| Requirement | Minimum |
|---|---|
| RAM | 2 GB |
| Disk | 20 GB free |
| OS | Ubuntu 22.04+ / Debian 12+ |
| Docker | 24+ with Compose v2 plugin |

## First-time server provisioning

```bash
curl -fsSL https://raw.githubusercontent.com/your-org/rednoxx-ehr/main/deploy/scripts/install.sh | sudo bash
```

The script verifies hardware, installs Docker, and creates `/opt/rednoxx-ehr`.

## Configuration

Copy `.env.example` → `.env` and fill in the required values:

```bash
cp .env.example /opt/rednoxx-ehr/.env
nano /opt/rednoxx-ehr/.env
```

Minimum values to set:

| Key | Description |
|---|---|
| `APP_KEY` | Run `php artisan key:generate --show` inside the container |
| `APP_URL` | Public URL of the installation |
| `DB_PASSWORD` | Strong random password |
| `AWS_ACCESS_KEY_ID` / `SECRET` | MinIO root credentials |

## First deploy

```bash
cp deploy/compose/docker-compose.prod.yml /opt/rednoxx-ehr/
cd /opt/rednoxx-ehr
IMAGE_NAME=rednoxx-ehr IMAGE_TAG=latest docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
docker compose -f docker-compose.prod.yml exec app php artisan db:seed --class=RolesAndPermissionsSeeder
```

## Creating the first admin user

```bash
docker compose -f docker-compose.prod.yml exec app php artisan tinker
# Inside tinker:
$user = \App\Domain\Shared\Models\User::create([
    'name'     => 'Administrator',
    'email'    => 'admin@your-facility.ng',
    'password' => bcrypt('change-me'),
    'cadre'    => 'admin',
]);
$user->assignRole('admin');
```

## Air-gapped / offline updates

See [runbooks/update.md](runbooks/update.md).

## Development setup

```bash
git clone <repo>
cd rednoxx-ehr
cp .env.example .env        # fill APP_KEY at minimum
make up
make migrate
make seed
```

### Git hooks

`make up` installs the shared git hooks automatically (via `core.hooksPath`).
To install them manually, run:

```bash
make hooks
```

- **pre-commit** — lints, type-checks and tests only the areas you changed
  (backend and/or frontend). Blocks the commit on any failure.
- **pre-push** — runs the full backend + frontend suite before a push.

Hooks run inside the Docker containers when they are up, otherwise against local
binaries. Emergency bypass (CI still enforces the same checks):
`git commit --no-verify` / `git push --no-verify`.
