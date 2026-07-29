# Architecture & Design

## Overview

Rednoxx EHR is a self-hosted, single-tenant EHR system targeting Nigerian primary and secondary healthcare facilities. Each facility runs its own isolated installation on an on-premise server. Updates are delivered via signed bundles, applied by an on-device agent — no cloud connectivity required during operation.

## System diagram

```
┌─────────────────────────────────────────────────────┐
│  Single Docker image (nginx + Octane inside)        │
│                                                     │
│  nginx :80                                          │
│    /          → /var/www/static (React SPA)         │
│    /api/*     → Octane :8000 (Laravel)              │
│    /sanctum/* → Octane :8000                        │
│    /internal/ → X-Accel-Redirect file serve         │
│                                                     │
│  Supervisord manages:                               │
│    nginx | octane | queue workers (×2) | scheduler  │
└──────────────┬──────────────────────────────────────┘
               │  docker network
    ┌──────────┼───────────────────────┐
    │          │                       │
postgres   redis              minio (S3)
(+ pgbouncer)
```

## Tech stack

| Concern | Choice | Reason |
|---|---|---|
| API runtime | Laravel 11 + Octane (Swoole) | Long-lived workers; low latency on modest hardware |
| Frontend | React 18 + Vite + TypeScript | Fast builds; strict typing |
| Auth | Laravel Sanctum (cookie) | Same-origin; no token management on client |
| RBAC | Spatie Permission | Role + direct-permission model; policy-based enforcement |
| Feature gating | Laravel Pennant | Per-facility module enable/disable without code deploy |
| Queue | Laravel Horizon + Redis | Visibility into background jobs; retry / dead-letter support |
| Object storage | MinIO (S3 API) | On-premise; files stay on the server |
| DB connection pooling | PgBouncer (prod only) | Keeps Octane's persistent connections from exhausting PostgreSQL |

## Domain modules

Each module follows the same internal structure:

```
Domain/<Module>/
├── Models/        # Eloquent models
├── Actions/       # single-responsibility command objects
└── DTOs/          # Spatie Data classes (validation + casting)

Http/Controllers/Api/V1/<Module>/   # thin HTTP layer, delegates to Actions
Http/Requests/<Module>/             # FormRequest validation
Http/Resources/<Module>/            # API response shapes
Policies/<Module>Policy.php         # RBAC gates
```

### Module map

| Module | Key entities |
|---|---|
| Patients | Patient, Allergy, MedicalHistory |
| Consultations | Consultation, Vital, Diagnosis (ICD-10), Referral |
| Pharmacy | Formulary, DispenseRecord, StockAdjustment |
| Billing | Invoice, LineItem, Payment, NHIAClaim |
| Queue | QueueEntry, QueueEvent |
| Shared | User, Facility, AuditLog |

## API design

- All endpoints under `/api/v1/`
- Sanctum cookie auth (CSRF via `/sanctum/csrf-cookie`)
- Consistent JSON envelope: `{ data: ..., meta?: ..., links?: ... }`
- Pagination via `?page=N&per_page=25`
- Filtering/sorting via Spatie QueryBuilder: `?filter[last_name]=okafor&sort=-created_at`
- Versioning: URL prefix only; breaking changes get a `/v2/` namespace

## Entitlements / licensing

Each facility has a signed license file containing:
- `facility_id`
- `modules[]` — list of enabled modules
- `expires_at`
- RSA signature (private key held by Rednoxx, public key baked into the image)

The `EntitlementService` reads and caches this; Pennant feature classes delegate to it. The frontend fetches `/api/v1/config` on boot and hides nav items for dark modules.

## Data migration strategy

All migrations follow the **expand/contract** pattern:
1. **Expand** — add new columns/tables (backward-compatible, old code still runs)
2. **Deploy** — update code to use new schema
3. **Contract** — remove old columns in a subsequent release

## Update delivery

```
CI builds → signs bundle → uploads to update server
                                    ↓
                           on-device agent polls
                                    ↓
                    verify sig → snapshot → apply → migrate
                                    ↓
                             health check
                            pass → commit
                            fail → rollback
```

Air-gapped sites receive USB bundles applied via `update-apply.sh`.

## Security considerations

- No internet connectivity required or assumed in prod
- All inter-container traffic stays on the Docker network (no external exposure except port 80)
- Secrets injected via Docker env, never baked into the image
- Audit log (Spatie Activitylog) for all model mutations
- X-Accel-Redirect for file downloads — files never pass through PHP on large transfers
- `SANCTUM_STATEFUL_DOMAINS` locked to the facility's own URL in prod
