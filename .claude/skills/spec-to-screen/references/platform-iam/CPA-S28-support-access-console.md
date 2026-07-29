# CPA-S28 — Controlled Support Access Console

| | |
| :---- | :---- |
| **Screen ID** | CPA-S28 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-026 (Controlled Vendor / Support Access) |
| **Linked requirements** | FR-CPA-API-023..-030 |
| **Primary roles** | Support User (vendor), Support Access Approver |
| **Route** | `/admin/support-access`, `/…/:id` |

## Purpose
Grant time-boxed, approved, closely-monitored support/vendor access to the system for
troubleshooting, with explicit scope, mandatory justification, session recording/monitoring
metadata, and automatic expiry — protecting patient data during support.

## Entry points & navigation
- Support user requests; approver acts from Admin Home “My tasks”. Sessions visible to Security.

## Layout
- **Request**: scope (module/facility/data-limited), reason, requested duration, ticket ref.
- **Approval queue**: pending requests + risk context; approve/limit/reject.
- **Active sessions**: countdown, activity summary, terminate-now.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Scope | select | yes | least-privilege support scope |
| Justification / ticket | text | yes | non-empty; ref retained |
| Duration | duration | yes | ≤ policy max |
| Data access level | select | yes | masked-by-default where possible |

## States
- **Pending → Approved (active, counting down) → Expired**; **Rejected**, **Terminated**.
- **Active session**: monitored; early terminate available.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Request support access | eligible support user |
| Approve/limit/reject | `support_access.approve` (≠ requester) |
| Terminate session | `support_access.approve` / Security Admin |

## Validations & business rules
- Time-boxed, least-privilege, approved access; auto-expiry; PHI masked by default where feasible.
- All support activity heightened-audited and attributable to the individual.
- No standing/shared vendor access.

## Audit events
- Request, approval decision, session start/end, terminate, data accessed — heightened audit.

## API needs
- `GET /admin/support-access`, `POST /request`.
- `POST /:id/approve|reject`, `POST /:id/terminate`.

## Interoperability / FHIR notes
- Any PHI access during support recorded as AuditEvent; masking rules applied.

## Acceptance criteria
1. Support access is time-boxed, scoped and auto-expires.
2. Requester cannot approve their own access.
3. Sessions are monitored and can be terminated immediately.
4. All support activity is heightened-audited and individually attributable.
