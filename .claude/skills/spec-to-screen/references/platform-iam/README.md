# Stream A — Platform Identity & Access (Developer 1)

**Module:** Core Platform & Administration (CPA) · **Screens:** 15 · **Feature folder:** `features/platform-iam` · **Route prefix:** `/admin`

> **Scope: UI conversion only.** Build the React + TypeScript UI for these screens against
> mocked/stubbed APIs and fixtures. Backend, real business logic and server-side security are
> out of scope — the `API needs` / `Audit` / `FHIR` / `business rules` sections in each spec
> are the contracts the UI honours.

Auth, users, RBAC, and the security/audit surface.
**This stream owns the RBAC permission catalogue + auth contract** consumed by every other stream.

- Plan & rules: [../../../../../DEVELOPER-WORKSTREAMS.md](../../../../../DEVELOPER-WORKSTREAMS.md)
- Module reference: [../../../../../core-platform-admin/README.md](../../../../../core-platform-admin/README.md)
- Conversion guide: [`spec-to-screen`](../../SKILL.md) — how these specs become React screens (pairs with the [`ehr-design`](../../../ehr-design/SKILL.md) skill)
- Implementation: [`app/src/features/platform-iam/`](../../../../../app/src/features/platform-iam)

| Screen | Name |
| :--- | :--- |
| CPA-S00 | [Admin Home](CPA-S00-admin-home.md) |
| CPA-S01 | [Login + MFA](CPA-S01-login-mfa.md) |
| CPA-S02 | [Account Activation & First Login](CPA-S02-activation-first-login.md) |
| CPA-S03 | [Password Reset & Recovery](CPA-S03-password-reset-recovery.md) |
| CPA-S09 | [User Directory](CPA-S09-user-directory.md) |
| CPA-S10 | [User Create & Invite](CPA-S10-user-create-invite.md) |
| CPA-S11 | [User Profile & Edit](CPA-S11-user-profile-edit.md) |
| CPA-S12 | [Account Lock / Suspension](CPA-S12-account-lock-suspension.md) |
| CPA-S13 | [Role List & Role Builder](CPA-S13-role-builder.md) |
| CPA-S14 | [Role Assignment & Access Scope](CPA-S14-role-assignment-scope.md) |
| CPA-S15 | [Privileged Access](CPA-S15-privileged-access.md) |
| CPA-S16 | [Periodic Access Review](CPA-S16-periodic-access-review.md) |
| CPA-S26 | [Audit Search & Export](CPA-S26-audit-search-export.md) |
| CPA-S27 | [API Client Registry](CPA-S27-api-client-registry.md) |
| CPA-S28 | [Support Access Console](CPA-S28-support-access-console.md) |
