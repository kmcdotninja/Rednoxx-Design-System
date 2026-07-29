# CPA-S11 — User Profile & Edit

| | |
| :---- | :---- |
| **Screen ID** | CPA-S11 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-006, WF-CPA-009 |
| **Linked requirements** | FR-CPA-UM-007..-015 |
| **Primary roles** | User Administrator (self-service subset for own profile) |
| **Route** | `/admin/users/:id` |

## Purpose
View and edit a user’s identity, contact, professional attributes, scope and roles; manage
account actions (reset password, transfer, deactivate); and review the user’s access and
activity history.

## Entry points & navigation
- From User Directory (CPA-S09). Tabs cross-link to CPA-S14 (role assignment), CPA-S12 (lock), CPA-S03 (reset), CPA-S26 (activity/audit).

## Layout
- Header: name, status chip, MFA state, scope, quick actions (reset, lock/unlock, transfer).
- Tabs: Identity/contact, Professional, Scope & roles, Sessions/devices, Activity/audit.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Name/contact | fields | partial | format checks |
| Cadre/licence | fields | conditional | reference list; format |
| Facility/department scope | multi-select | yes | active org units; transfer flow |
| Roles (read + link) | list | — | edit via CPA-S14 |
| Status | chip/action | — | via lock/deactivate flows |

## States
- **Read-only** (insufficient permission), **edit/dirty**, **validation error**.
- **Transfer in progress**: scope change may require approval.
- **Deactivated user**: edits limited; reactivation flow available.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| View profile | `user.view` (scoped) |
| Edit identity/professional | `user.manage` |
| Change scope / transfer | `user.manage` (may need approval) |
| Reset password | `user.reset_password` → CPA-S03 |
| Lock/unlock/suspend | `user.security` → CPA-S12 |
| Deactivate/reactivate | `user.manage` |

## Validations & business rules
- No hard delete of users with activity; deactivate/retire instead.
- Scope/transfer preserves history; role changes SoD-checked.
- Self-service edits limited to non-privilege fields.

## Audit events
- Profile/scope/status changes, password reset initiation, transfer — with before/after.

## API needs
- `GET /admin/users/:id`, `PATCH /admin/users/:id`.
- `POST /admin/users/:id/transfer`, `POST /:id/status`.
- `GET /admin/users/:id/sessions`, `GET /:id/activity`.

## Interoperability / FHIR notes
- Reflects to Practitioner/PractitionerRole; scope changes update role context.

## Acceptance criteria
1. Edits respect permission and scope; unauthorized fields are read-only.
2. Users cannot be hard-deleted when they have activity.
3. Transfers/scope changes preserve history and are audited.
4. Account actions (reset/lock/deactivate) route to the correct flows and are logged.
