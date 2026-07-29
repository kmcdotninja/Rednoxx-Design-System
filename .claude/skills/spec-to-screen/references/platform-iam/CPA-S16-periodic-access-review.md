# CPA-S16 — Periodic Access Review

| | |
| :---- | :---- |
| **Screen ID** | CPA-S16 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-014 (Periodic Access Certification / Review) |
| **Linked requirements** | FR-CPA-RBAC-031..-040 |
| **Primary roles** | Access Manager, Department Head (reviewer) |
| **Route** | `/admin/access/reviews`, `/…/:id` |

## Purpose
Run periodic access-certification campaigns where reviewers confirm or revoke each user’s
roles/scope, producing an auditable attestation for compliance.

## Entry points & navigation
- Campaigns created by Access Manager; reviewer tasks appear in Admin Home “My tasks”.

## Layout
- **Campaign list**: name, scope, period, progress, status.
- **Review worklist**: per-user rows (roles, scope, last used, risk) with Confirm / Revoke / Flag + comment; bulk confirm.
- **Certification summary**: completion %, exceptions, sign-off.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Campaign scope/period | config | yes | valid dates/scope |
| Reviewer decision | select | yes per row | confirm/revoke/flag |
| Comment | text | conditional | required on revoke/flag |
| Sign-off | attestation | yes | reviewer identity + timestamp |

## States
- **Draft/Active/Overdue/Completed** campaign.
- **Row states**: pending, confirmed, revoke-pending, flagged.
- **Revoke executes** on completion/approval; overdue escalation.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Create/manage campaign | `access_review.manage` |
| Review & attest | `access_review.certify` (assigned reviewer) |
| Escalate overdue | system/Access Manager |

## Validations & business rules
- Every in-scope assignment must get a decision before campaign closes.
- Revocations flow into role-assignment changes (CPA-S14), audited.
- Attestations non-repudiable; overdue items escalate.

## Audit events
- Campaign created/closed, per-row decisions, revocations executed, sign-off, escalations.

## API needs
- `GET /admin/access/reviews`, `POST /reviews`, `GET /:id/items`.
- `POST /reviews/:id/items/:iid/decision`, `POST /reviews/:id/complete`.

## Interoperability / FHIR notes
- Revocations update PractitionerRole; attestation stored as evidence record.

## Acceptance criteria
1. A campaign cannot close until every in-scope assignment has a decision.
2. Revocations execute and are reflected in assignments and audited.
3. Reviewer attestations are recorded non-repudiably.
4. Overdue reviews escalate.
