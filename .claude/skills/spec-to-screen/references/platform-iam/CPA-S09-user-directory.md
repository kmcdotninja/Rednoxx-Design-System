# CPA-S09 — User Directory (List & Search)

| | |
| :---- | :---- |
| **Screen ID** | CPA-S09 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-006, WF-CPA-010 |
| **Linked requirements** | FR-CPA-UM-001..-010 |
| **Primary roles** | User Administrator, Security Administrator |
| **Route** | `/admin/users` |

## Purpose
Central searchable directory of all user accounts with status, roles, facility scope and
last activity — the entry point for creating, editing, locking and reviewing users.

## Entry points & navigation
- From “Users & Access”. Rows → CPA-S11 (profile). “New user” → CPA-S10.

## Layout
- Filter bar (status, role, facility/department, MFA state, search).
- Data table: name, username/email, roles, facility scope, status, last login, MFA.
- Bulk actions bar (where permitted): lock, force reset, export list.

## Components & fields
| Component | Type | Notes |
| :---- | :---- | :---- |
| Search | text | name/email/username |
| Filters | multi | status, role, scope, MFA |
| User table | data table | sortable, paginated, scoped |
| Row actions | menu | view, edit, lock/unlock, reset |
| Bulk actions | toolbar | permission-gated |

## States
- **Loading/empty/no-results**, **error with retry**.
- **Scoped view**: admin sees only users within their facility scope.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| View directory | `user.view` (scoped) |
| Open profile | `user.view` |
| Bulk lock/reset | `user.manage` / `user.reset_password` |
| Export list | `user.export` (audited) |

## Validations & business rules
- Results and actions restricted to caller’s scope (BR-CPA-004).
- Export is audited; excludes secrets.

## Audit events
- Directory export; bulk actions logged per user affected.

## API needs
- `GET /admin/users?filters` (paginated, scoped).
- `POST /admin/users/bulk` (lock/reset).
- `GET /admin/users/export`.

## Interoperability / FHIR notes
- Users map to Practitioner/PractitionerRole; no external publish here.

## Acceptance criteria
1. Directory shows only users within the admin’s scope.
2. Filters/search return correct scoped results.
3. Bulk/export actions are permission-gated and audited.
