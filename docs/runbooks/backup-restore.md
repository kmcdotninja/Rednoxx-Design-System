# Runbook: Backup & Restore

## What to back up

| Data | Location | Priority |
|---|---|---|
| PostgreSQL database | `postgres_data` Docker volume | Critical |
| MinIO objects (files) | `minio_data` Docker volume | High |
| `.env` configuration | `/opt/rednoxx-ehr/.env` | High |
| Compose file | `/opt/rednoxx-ehr/docker-compose.prod.yml` | Medium |

## Database backup

```bash
# Dump to a timestamped file
docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml exec -T postgres \
  pg_dump -U $DB_USERNAME $DB_DATABASE | gzip > "ehr-db-$(date +%Y%m%d-%H%M%S).sql.gz"
```

Schedule this in cron (daily, 02:00):

```cron
0 2 * * * docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml exec -T postgres pg_dump -U ehr ehr | gzip > /backups/ehr-db-$(date +\%Y\%m\%d).sql.gz
```

## MinIO object backup

```bash
# Using the mc (MinIO client) alias configured on the server
mc mirror minio/ehr /backups/minio-$(date +%Y%m%d)/
```

## Restore database

```bash
# 1. Stop the app to prevent writes during restore
docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml stop app worker

# 2. Drop and recreate the database
docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml exec postgres \
  psql -U ehr -c "DROP DATABASE IF EXISTS ehr; CREATE DATABASE ehr;"

# 3. Restore from dump
gunzip -c ehr-db-20240101-020000.sql.gz | \
  docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml exec -T postgres \
  psql -U ehr ehr

# 4. Start the app
docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml start app worker

# 5. Verify
curl -s http://localhost/api/health | jq .
```
