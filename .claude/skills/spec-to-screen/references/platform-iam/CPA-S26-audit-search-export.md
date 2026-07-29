# CPA-S26 — Audit Log Search & Evidence Export

| | |
| :---- | :---- |
| **Screen ID** | CPA-S26 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-024 (Audit Log Review & Evidence Export) |
| **Linked requirements** | FR-CPA-API-001..-010; NFR-CPA-SEC-004 |
| **Primary roles** | Auditor, Security Administrator |
| **Route** | `/admin/audit` |

## Purpose
Search, filter and inspect the immutable audit trail (who did what, when, to which record,
outcome) and export tamper-evident evidence packages for investigations and compliance.

## Entry points & navigation
- From “Audit & Integration”. Deep-links from user/security/config screens (view activity).

## Layout
- Filter bar: actor, subject/record, action type, module, date range, outcome, facility scope.
- Results table (read-only), row → event detail (full context, before/after where applicable).
- Export panel (scope, format, reason) with re-auth.

## Components & fields
| Component | Type | Notes |
| :---- | :---- | :---- |
| Filters | multi | actor/subject/action/date/scope |
| Results table | data table | read-only, paginated |
| Event detail | panel | full immutable record |
| Export | action | reason required; re-auth; audited |

## States
- **Loading/empty/no-results**, **large-result guidance** (refine filters).
- **Export in progress / ready**, **export denied** (out of scope).

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Search/view audit | `audit.view` (scoped; read-only) |
| Export evidence | `audit.export` (reason + re-auth; itself audited) |

## Validations & business rules
- Audit records are immutable and read-only (NFR-CPA-SEC-004); no edit/delete in UI.
- Access scoped; exports themselves are audited and tamper-evident.
- PHI access via audit respects data-protection and is itself logged.

## Audit events
- Audit search performed, event viewed (if policy), evidence exported — logged.

## API needs
- `GET /admin/audit?filters` (paginated), `GET /admin/audit/:id`.
- `POST /admin/audit/export` (returns signed package).

## Interoperability / FHIR notes
- Aligns to AuditEvent semantics; export packages support external investigations.

## Acceptance criteria
1. Audit data is strictly read-only in the UI.
2. Search results and exports respect the user’s scope.
3. Exporting requires a reason + re-auth and is itself audited.
4. Exported evidence is tamper-evident.
