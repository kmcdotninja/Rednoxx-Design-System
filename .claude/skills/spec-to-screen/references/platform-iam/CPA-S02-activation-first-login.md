# CPA-S02 — Account Activation & First Login

| | |
| :---- | :---- |
| **Screen ID** | CPA-S02 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | WF-CPA-007 (User Activation and First Login) |
| **Linked requirements** | FR-CPA-AUTH-001..-012; FR-CPA-UM-003 |
| **Primary roles** | New user (invited) |
| **Route** | `/activate?token=…` |

## Purpose
Let an invited user validate their activation token, set a compliant password, enrol MFA
where required, accept acceptable-use/privacy notices, and activate the account.

## Entry points & navigation
- Reached from an emailed/SMS activation link.
- Success → CPA-S01 (or auto-login to role home per policy).

## Layout
- Stepper: (1) Verify → (2) Set password → (3) Enrol MFA → (4) Accept notices → Done.
- Password strength meter; policy checklist; MFA enrolment (QR/app or phone/email factor).
- Notice acceptance with scrollable text + explicit checkbox.

## Components & fields
| Field | Type | Required | Validation |
| :---- | :---- | :---- | :---- |
| Activation token | hidden/derived | yes | valid + not expired |
| New password | password | yes | complexity/expiry/reuse policy (FR-CPA-AUTH-002) |
| Confirm password | password | yes | must match |
| MFA factor setup | component | conditional | required for privileged roles; verify enrolment code |
| Accept AUP/privacy | checkbox | yes | must be checked to proceed |

## States
- **Expired/invalid token**: block; offer “request new invite” (routes to admin/self-service).
- **Weak password**: inline policy failures.
- **MFA enrolment failed**: retry; cannot finish if MFA required.
- **Already activated**: redirect to login.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| Verify token | token-scoped, public |
| Complete activation | token-scoped |

## Validations & business rules
- Token expiry enforced; no plaintext password stored (NFR-CPA-SEC-003).
- Cannot log in until password + MFA (if required) + notices complete.
- Account status transitions `Pending Activation → Active` (FR-CPA-UM-002).

## Audit events
- Activation started/completed, password set, MFA enrolled, notices accepted, first login.

## API needs
- `GET /auth/activation/{token}` → validity + required steps.
- `POST /auth/activation/{token}/complete` → `{ password, mfaEnrolment, noticesAccepted }`.

## Interoperability / FHIR notes
- On activation, user becomes an active Practitioner/PractitionerRole-ready record.

## Acceptance criteria
1. An expired token cannot activate an account.
2. Privileged users must enrol MFA before activation completes.
3. Notices must be accepted to proceed; acceptance is recorded.
4. Activated account can then log in via CPA-S01.
