# CPA-S13 — Role List & Role Builder

| | |
| :---- | :---- |
| **Screen ID** | CPA-S13 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-011 (Role Definition & Permission Assignment) |
| **Linked requirements** | FR-CPA-RBAC-001..-010; BR-CPA-007 |
| **Primary roles** | Role Administrator, Security Administrator |
| **Route** | `/admin/access/roles`, `/…/:id` |

## Purpose
Define and maintain roles as named sets of permissions, under the configuration lifecycle
with approval, so access is granted by role rather than ad hoc — enforcing least privilege
and segregation of duties.

## Entry points & navigation
- From “Users & Access”. Roles consumed by CPA-S14 (assignment). Changes route through approval.

## Layout
- **List**: roles with status chip, scope, #permissions, #assigned users, version.
- **Builder**: permission tree/matrix (by module/capability), role metadata, SoD warnings, approval stepper.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Role name/code | text | yes | unique |
| Description | text | recommended | — |
| Scope type | select | yes | facility/department/global |
| Permissions | tree/matrix | yes | valid permission keys |
| Status | lifecycle | — | Draft→…→Active |

## States
- **Draft/Pending Review/Approved/Published/Active/Deprecated/Retired**, **Rejected/Returned**.
- **SoD conflict**: flag toxic permission combinations; block publish until resolved/justified.
- **In-use role edit**: creates a new version; existing assignments reference prior version until published.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| View roles | `role.view` |
| Create/edit draft | `role.manage` |
| Submit/approve/publish | `role.approve` (approver ≠ author — SoD) |
| Deprecate/retire | `role.manage` + governed change |

## Validations & business rules
- Unique role code; least-privilege defaults (BR-CPA-007).
- Author cannot solely approve their own role change (SoD).
- Versioned; no hard delete when assigned — deprecate/retire.
- SoD-conflicting permission sets blocked or explicitly justified.

## Audit events
- Role created/edited, submitted, approved/rejected, published, deprecated/retired — with diff.

## API needs
- `GET /admin/access/roles`, `GET /:id`, `GET /:id/versions`.
- `POST /admin/access/roles`, `PATCH /:id`, `POST /:id/transition`.

## Interoperability / FHIR notes
- Roles underpin PractitionerRole scoping; no external publish.

## Acceptance criteria
1. Roles follow the lifecycle and require approval by a different user than the author.
2. SoD-conflicting permission sets cannot be published without justification.
3. Editing an in-use role creates a new version without breaking existing assignments.
4. All role changes are versioned and audited with diffs.
