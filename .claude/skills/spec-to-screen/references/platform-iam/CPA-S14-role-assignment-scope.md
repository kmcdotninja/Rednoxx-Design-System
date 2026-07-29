# CPA-S14 — User Role Assignment & Access Scope

| | |
| :---- | :---- |
| **Screen ID** | CPA-S14 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-012 (User Role Assignment & Access Scoping) |
| **Linked requirements** | FR-CPA-RBAC-011..-020; BR-CPA-008 |
| **Primary roles** | User Administrator, Access Approver |
| **Route** | `/admin/users/:id/access` |

## Purpose
Assign/revoke roles for a user and set the data scope (facility/department) each role
applies to, with time-bounding where needed, approval for sensitive roles, and SoD checks.

## Entry points & navigation
- From User Profile (CPA-S11) “Scope & roles”. Sensitive roles route to CPA-S15/approval.

## Layout
- Current assignments table (role, scope, effective dates, status) + “add assignment” panel.
- SoD conflict banner; approval stepper for sensitive assignments.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Role | select | yes | active roles only |
| Scope | multi-select | yes | within admin’s scope; active org units |
| Effective from/to | date | conditional | time-bound for temporary access |
| Justification | text | conditional | required for sensitive roles |

## States
- **SoD conflict**: block/justify.
- **Approval required**: assignment created `Pending Approval`, inactive until approved.
- **Expired assignment**: auto-deactivates; shown historically.
- **Revoke**: immediate effect, reason required.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Assign non-sensitive role | `role.assign` (within scope) |
| Assign sensitive/privileged role | `role.assign` + approval (CPA-S15) |
| Revoke role | `role.assign` (reason) |

## Validations & business rules
- Assignments limited to the admin’s own scope (BR-CPA-008).
- SoD conflicts blocked; sensitive roles require approval and may be time-bound.
- Expiry auto-revokes; all changes preserve history.

## Audit events
- Role assigned/revoked/expired, scope set, approval decisions — with actor, reason, dates.

## API needs
- `GET /admin/users/:id/assignments`.
- `POST /admin/users/:id/assignments`, `POST /assignments/:aid/revoke`.
- `POST /assignments/:aid/approve|reject`.

## Interoperability / FHIR notes
- Materialises PractitionerRole with scope; effective dates map to period.

## Acceptance criteria
1. Admins can assign only roles/scopes within their own scope.
2. Sensitive-role assignments stay inactive until approved.
3. Time-bound assignments auto-expire and are retained historically.
4. All assignment changes are audited with reasons/dates.
