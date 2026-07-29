# CPA-S10 — User Create & Invite

| | |
| :---- | :---- |
| **Screen ID** | CPA-S10 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-006 (User Account Provisioning) |
| **Linked requirements** | FR-CPA-UM-001..-006; BR-CPA-005 |
| **Primary roles** | User Administrator |
| **Route** | `/admin/users/new` |

## Purpose
Create a new user account with identity, professional attributes, facility/department scope
and initial roles, then send an activation invite (CPA-S02) — enforcing least privilege and
uniqueness.

## Entry points & navigation
- From User Directory (CPA-S09) “New user”. Success → CPA-S11 (profile) or back to directory.

## Layout
- Wizard: (1) Identity/contact → (2) Professional details (cadre, licence no.) → (3) Scope (facility/department) → (4) Roles → (5) Review & invite.
- Duplicate-check panel (name/email/licence) before commit.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Full name | text | yes | non-empty |
| Email / username | text | yes | unique; valid format |
| Phone | text | conditional | format check |
| Cadre / profession | select | conditional | from reference list |
| Licence/registration no. | text | conditional | format; uniqueness if applicable |
| Facility/department scope | multi-select | yes | active org units only |
| Initial roles | multi-select | yes | least-privilege guidance; SoD checks |

## States
- **Duplicate detected**: warn + require confirm/link to existing.
- **Validation errors**, **dirty guard**.
- **SoD conflict**: block conflicting role combos with explanation.
- **Invite sent**: confirmation; account in `Pending Activation`.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Create user | `user.create` (scoped) |
| Assign initial roles | `role.assign` (within scope; SoD-checked) |

## Validations & business rules
- Unique email/username (and licence where applicable); no shared accounts (BR-CPA-005).
- Least privilege — default minimal roles; SoD conflicts blocked.
- New account starts `Pending Activation`; invite triggers CPA-S02.

## Audit events
- User created, roles assigned, invite sent — with actor and snapshot.

## API needs
- `POST /admin/users` (returns pending user + invite status).
- `GET /admin/users/duplicate-check?…`.
- `POST /admin/users/:id/invite`.

## Interoperability / FHIR notes
- Creates Practitioner/PractitionerRole-ready record; roles scope PractitionerRole.

## Acceptance criteria
1. Duplicate identity is detected and must be confirmed/linked before creation.
2. SoD-conflicting role combinations are blocked.
3. New user is created in Pending Activation and receives an invite.
4. Creation and role assignment are audited.
