# Runbook: Applying an Update

## Connected site (receives bundle from update server)

The on-device update agent runs nightly and applies updates automatically when a new bundle is available and the clinic is outside opening hours.

To trigger manually:

```bash
ssh admin@<server-ip>
sudo /opt/rednoxx-ehr/agent/check-and-apply.sh
```

## Air-gapped site (USB bundle)

1. Download the bundle from the Rednoxx partner portal onto a USB drive.
2. Copy the bundle to the server:
   ```bash
   scp /media/usb/ehr-update-1.2.0.tar.gz admin@<server-ip>:/tmp/
   ```
3. Run the apply script:
   ```bash
   ssh admin@<server-ip>
   sudo /opt/rednoxx-ehr/deploy/scripts/update-apply.sh /tmp/ehr-update-1.2.0.tar.gz
   ```
4. The script will verify the bundle signature, snapshot the current image, apply migrations, restart the app, and confirm a health check before committing.

## What the script does

```
verify signature
  ↓
snapshot current image tag
  ↓
load new image
  ↓
copy new compose file
  ↓
run migrations (--force)
  ↓
docker compose up --force-recreate
  ↓
health check (up to 60s)
  pass → log success
  fail → rollback to snapshot
```

## Verifying success

```bash
curl -s http://localhost/api/health | jq .
# Expected: {"status":"ok"}

docker compose -f /opt/rednoxx-ehr/docker-compose.prod.yml ps
# All services should show "healthy"
```
