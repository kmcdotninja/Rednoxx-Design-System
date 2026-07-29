# CPA-S01 — Login + MFA

| | |
| :---- | :---- |
| **Screen ID** | CPA-S01 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-008 (Routine Login with MFA and Session Creation) |
| **Linked requirements** | FR-CPA-AUTH-001, -003, -005, -007, -008, -013..-025; NFR-CPA-SEC-001 |
| **Primary roles** | Any user |
| **Route** | `/login`, `/login/mfa` |

## Purpose
Authenticate a user with credentials plus, where required, a second factor, and create a
scoped session that lands the user on their role-appropriate workspace.

## Entry points & navigation
- Unauthenticated access to any protected route redirects here.
- Success → role home (admins → CPA-S00; clinical → clinical workspace).
- Links: “Forgot password?” → CPA-S03; activation handled by CPA-S02.

## Layout
- Centered card on branded background.
- Step 1: username/email, password, “Remember this device” (policy-gated), submit.
- Step 2 (conditional): MFA challenge — OTP/app-token input, “resend/alternate factor”, submit.
- System announcement banner region (from CPA-S29) above the card.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Username / email | text | yes | non-empty; format check for email |
| Password | password | yes | non-empty; never echoed/logged |
| Remember device | checkbox | no | only if policy allows; affects MFA prompt frequency |
| MFA code | text (numeric/token) | yes (when challenged) | length/format per configured factor; expiry enforced |

## States
- **Loading**: submit spinner; inputs disabled.
- **Invalid credentials**: generic error (no user-enumeration), attempt counter increments.
- **Account locked/suspended/inactive**: safe message + support/reset guidance; no login.
- **Expired password**: route to forced password change.
- **MFA required**: advance to step 2; MFA failure shows retry with throttle.
- **MFA provider unavailable**: apply configured fallback policy; log event.
- **Rate-limited / lockout**: show cooldown message.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Submit credentials | public endpoint (rate-limited) |
| Submit MFA | session-challenge token |
| Resend / switch factor | if user enrolled in alternate factor |

## Validations & business rules
- Unique credentials per interactive account (FR-CPA-AUTH-001); no shared accounts.
- Lockout/throttle after configurable failed attempts (FR-CPA-AUTH-005).
- MFA mandatory for privileged users (FR-CPA-AUTH-003; BR-CPA-002).
- Session + idle timeout by role/risk (FR-CPA-AUTH-007).
- No plaintext credential storage/display (NFR-CPA-SEC-003).

## Audit events
- Successful login, failed login, MFA success/failure, lockout — with actor, IP/device, timestamp, outcome (FR-CPA-AUTH-008).

## API needs
- `POST /auth/login` → `{ mfaRequired, challengeToken? } | session`.
- `POST /auth/mfa/verify` → session.
- `POST /auth/mfa/resend`.
- `GET /announcements/login` → login banner notices.

## Interoperability / FHIR notes
- Session maps to Practitioner/PractitionerRole context downstream; no external call here.

## Acceptance criteria
1. Valid credentials + valid MFA create a scoped session and land the user on their role home.
2. Privileged users cannot complete login without MFA.
3. Failed attempts throttle/lock per policy and are audited.
4. Error messages do not reveal whether an account exists.
