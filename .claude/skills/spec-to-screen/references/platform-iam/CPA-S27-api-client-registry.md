# CPA-S27 — API Client Registry & Credential Rotation

| | |
| :---- | :---- |
| **Screen ID** | CPA-S27 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-025 (Integration / API Client Registration & Credential Management) |
| **Linked requirements** | FR-CPA-API-011..-022; BR-CPA-015 |
| **Primary roles** | Integration Administrator |
| **Route** | `/admin/integration/clients`, `/…/:id` |

## Purpose
Register and manage external API clients/integrations (scopes, allowed endpoints, IP allow-
lists), issue and rotate credentials securely, and enable/disable access — supporting
NDHI/DHIN interoperability under least privilege.

## Entry points & navigation
- From “Audit & Integration”. Clients power external FHIR/DHIN and partner integrations.

## Layout
- **List**: clients with status, scopes, last used, credential age.
- **Detail**: identity, granted scopes/endpoints, IP allow-list, credential management (rotate/revoke), usage/rate limits, audit.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Client name | text | yes | unique |
| Scopes | multi-select | yes | least-privilege set |
| Allowed endpoints | multi | conditional | valid API surface |
| IP allow-list | list | no | valid CIDR/IP |
| Rate limit | config | no | valid values |
| Status | select | yes | Active/Disabled |

## States
- **Credential shown once** on generation (never re-displayed).
- **Rotating** (grace overlap window), **revoked**, **disabled**.
- **Stale credential warning** (age threshold).

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| View clients | `apiclient.view` |
| Create/edit client | `apiclient.manage` |
| Rotate/revoke credential | `apiclient.manage` (high-risk re-auth) |
| Enable/disable | `apiclient.manage` |

## Validations & business rules
- Secrets shown once, stored hashed, never logged/redisplayed (BR-CPA-015, NFR-CPA-SEC-003).
- Least-privilege scopes; rotation supports overlap grace to avoid outages.
- Disable/revoke immediately blocks access; all changes audited.

## Audit events
- Client created/edited, scope change, credential generated/rotated/revoked, enable/disable.

## API needs
- `GET /admin/integration/clients`, `GET /:id`, `POST`, `PATCH /:id`.
- `POST /:id/credentials/rotate`, `POST /:id/credentials/revoke`, `POST /:id/status`.

## Interoperability / FHIR notes
- Clients are the access layer for FHIR/DHIN endpoints; scopes gate resource access.

## Acceptance criteria
1. A generated secret is shown only once and never redisplayed.
2. Rotation supports an overlap window; revoke blocks access immediately.
3. Credential actions require re-auth and are audited.
4. Client scopes follow least privilege.
