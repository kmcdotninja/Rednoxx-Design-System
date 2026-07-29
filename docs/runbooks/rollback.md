# Runbook: Rolling Back

## Automatic rollback

The `update-apply.sh` script rolls back automatically if the health check fails after applying a bundle. No manual action needed in that case.

## Manual rollback

If a problem is discovered after a successful update:

### 1. Identify the previous image tag

```bash
docker image ls rednoxx-ehr --format "{{.Tag}}\t{{.CreatedAt}}" | sort -rk2 | head -5
```

### 2. Update the compose file to pin the old tag

```bash
cd /opt/rednoxx-ehr
nano docker-compose.prod.yml   # change IMAGE_TAG to the previous version
```

Or set the env var directly:

```bash
IMAGE_TAG=1.1.3 docker compose -f docker-compose.prod.yml up -d --force-recreate app
```

### 3. Reverse migrations (if any)

Check the release notes for the update you're rolling back from. If the release included **contract** migrations (column drops), you cannot automatically reverse them — restore from a database snapshot instead.

```bash
docker compose -f docker-compose.prod.yml exec app php artisan migrate:rollback --step=1
```

### 4. Confirm health

```bash
curl -s http://localhost/api/health | jq .
```

## Restoring from a database backup

See [backup-restore.md](backup-restore.md).
