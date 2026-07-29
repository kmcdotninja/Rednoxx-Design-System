# CPA-S12 — Account Lock / Unlock / Suspension

| | |
| :---- | :---- |
| **Screen ID** | CPA-S12 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-010 (Account Lock, Unlock & Suspension) |
| **Linked requirements** | FR-CPA-UM-016..-022; BR-CPA-006 |
| **Primary roles** | Security Administrator |
| **Route** | `/admin/users/:id/security` (modal/panel) |

## Purpose
Lock, unlock, or suspend an account in response to security events, HR actions or policy,
with mandatory reason, optional session termination, and full auditability.

## Entry points & navigation
- From User Profile (CPA-S11) or a security alert (CPA-S19). Modal/side panel.

## Layout
- Action selector (Lock / Unlock / Suspend / Reinstate), reason (required), duration
  (for temporary suspension), toggle “terminate active sessions”, confirmation with re-auth.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Action | select | yes | valid transition for current status |
| Reason | text | yes | non-empty; retained in audit |
| Duration | duration | conditional | required for temporary suspension |
| Terminate sessions | toggle | no | default on for lock/suspend |
| Re-auth | challenge | yes | high-risk action |

## States
- **Invalid transition**: block (e.g., unlock an active account).
- **Confirm/re-auth required**, **success**, **error**.
- **Auto-lock context**: pre-filled reason when arriving from an alert.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Lock/suspend | `user.security` |
| Unlock/reinstate | `user.security` (may require secondary approval per policy) |

## Validations & business rules
- Reason mandatory; only valid status transitions allowed (BR-CPA-006).
- Locked/suspended users cannot authenticate; sessions terminated where selected.
- Reinstatement may require secondary approval for privileged accounts.

## Audit events
- Lock/unlock/suspend/reinstate with actor, reason, duration, session-termination outcome.

## API needs
- `POST /admin/users/:id/security` `{ action, reason, duration?, terminateSessions }`.

## Interoperability / FHIR notes
- None external; disables PractitionerRole access.

## Acceptance criteria
1. Every security action requires a reason and re-authentication.
2. Only valid status transitions are permitted.
3. Locked/suspended users cannot log in and selected sessions are terminated.
4. All actions are audited with reason and duration.
