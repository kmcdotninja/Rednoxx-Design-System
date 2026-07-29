# CPA-S15 — Privileged Access Request & Approval

| | |
| :---- | :---- |
| **Screen ID** | CPA-S15 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-013 (Privileged / Break-Glass Access Request & Approval) |
| **Linked requirements** | FR-CPA-RBAC-021..-030; BR-CPA-009 |
| **Primary roles** | Requester (any eligible), Security Administrator / Approver |
| **Route** | `/admin/access/privileged`, `/…/:id` |

## Purpose
Request, approve and time-limit elevated/break-glass access with strong justification,
multi-party approval, automatic expiry and heightened auditing.

## Entry points & navigation
- Requester raises from here or from CPA-S14. Approvers act from Admin Home “My tasks”.
- Break-glass may allow immediate access with mandatory post-hoc review.

## Layout
- **Request form**: privilege/role, scope, reason, duration, patient/context (if break-glass).
- **Approval queue**: pending requests with justification, requester history, approve/reject/return.
- **Active grants**: countdown to expiry, early-revoke.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Privilege/role | select | yes | eligible privileged roles |
| Scope/context | select | yes | valid scope |
| Justification | text | yes | detailed; retained |
| Duration | duration | yes | ≤ policy max |
| Break-glass flag | toggle | conditional | triggers post-hoc review |

## States
- **Pending approval**, **approved (active, counting down)**, **rejected/returned**, **expired**, **revoked**.
- **Break-glass active**: immediate access + flagged for mandatory review.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Raise request | authenticated user (eligible) |
| Approve/reject/return | `privileged.approve` (≠ requester; SoD) |
| Break-glass invoke | policy-gated; auto-notifies security |
| Early revoke | `privileged.approve` / Security Admin |

## Validations & business rules
- Time-bounded, least-privilege; approver ≠ requester (BR-CPA-009).
- Auto-expiry; break-glass requires post-hoc review sign-off.
- Heightened, non-repudiable audit for all privileged activity.

## Audit events
- Request raised, approval decision, grant activated, break-glass invoked, expiry, revoke, post-hoc review.

## API needs
- `GET /admin/access/privileged`, `POST /request`.
- `POST /:id/approve|reject|return`, `POST /:id/revoke`.
- `POST /:id/break-glass`, `POST /:id/review`.

## Interoperability / FHIR notes
- Elevated PractitionerRole with tight period; break-glass access flagged in audit trail.

## Acceptance criteria
1. Privileged access is time-bounded and auto-expires.
2. Requester cannot approve their own request.
3. Break-glass grants immediate access but forces post-hoc review.
4. All privileged activity is heightened-audited.
