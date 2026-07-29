# CPA-S03 — Password Reset & Account Recovery

| | |
| :---- | :---- |
| **Screen ID** | CPA-S03 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-009 (Password Reset and Account Recovery) |
| **Linked requirements** | FR-CPA-AUTH-006, -026..-035 |
| **Primary roles** | User (self-service); User/Security Administrator (admin-initiated) |
| **Route** | `/reset`, `/reset/confirm?token=…` |

## Purpose
Allow a user to securely reset a forgotten password via an expiring one-time token, or an
administrator to initiate recovery, invalidating active sessions where configured.

## Entry points & navigation
- “Forgot password?” from CPA-S01 (self-service).
- Admin-initiated from CPA-S11 (User Profile).
- Success → CPA-S01.

## Layout
- **Request step**: identifier input (email/username) → “send reset”.
- **Confirm step** (from link): new password + confirm, strength meter, policy checklist.
- Neutral confirmation messaging (no account enumeration).

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Identifier | text | yes | format check; response is always neutral |
| New password | password | yes (confirm step) | complexity/reuse policy |
| Confirm password | password | yes | must match |

## States
- **Request submitted**: neutral “if an account exists, a reset link was sent”.
- **Unknown/locked account**: same neutral message; internal handling differs, logged.
- **Expired token**: block; offer new request.
- **Abuse/throttle**: cooldown message.
- **Compromise flagged**: route to security review; may require admin unlock.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Request reset | public, rate-limited |
| Confirm reset | token-scoped |
| Admin-initiate reset | `user.reset_password` (User/Security Admin) |

## Validations & business rules
- Time-bound one-time token (FR-CPA-AUTH-006).
- No password disclosure; sessions invalidated where configured (FR-CPA-AUTH-030).
- Abuse throttling; all attempts auditable.

## Audit events
- Reset requested, token issued, reset completed, admin-initiated reset, session invalidation.

## API needs
- `POST /auth/reset/request`.
- `GET /auth/reset/{token}` → validity.
- `POST /auth/reset/{token}/confirm`.
- `POST /admin/users/{id}/reset` (admin-initiated).

## Interoperability / FHIR notes
- None.

## Acceptance criteria
1. Reset works only with a valid, unexpired token.
2. Responses never reveal whether an account exists.
3. Admin-initiated reset invalidates sessions per policy and is audited.
4. Repeated abuse is throttled.
