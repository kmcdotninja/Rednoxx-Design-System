# CPA-S00 — Admin Home / Landing Dashboard

| | |
| :---- | :---- |
| **Screen ID** | CPA-S00 |
| **Module** | Core Platform & Administration |
| **Linked workflows** | — (entry surface for all `WF-CPA-*`) |
| **Linked requirements** | FR-CPA-DASH-001, NFR-CPA-SEC-001 |
| **Primary roles** | Super Admin, Facility Admin, Security Admin, User Admin (role-filtered) |
| **Route** | `/admin` |

## Purpose
Role-aware landing surface after login. Surfaces the admin capabilities the user is
permitted to use, plus at-a-glance operational/security signals and pending tasks
(approvals, access reviews, alerts).

## Entry points & navigation
- Default redirect after successful login (CPA-S01) for users with any admin permission.
- Left nav (persistent) groups: Organisation, Users & Access, Forms & Workflows,
  Dashboards & Alerts, Audit & Integration, Resilience. Nav items hidden if no permission.
- Top bar: facility/scope selector, global search, logged-in user + session/MFA indicator, logout.

## Layout
- **Top bar** (global, all admin screens): facility scope selector · search · notifications bell · user menu.
- **Left nav** (grouped, role-filtered).
- **Main region**:
  - Row 1: KPI tiles (counts) — Active users, Pending activations, Locked/suspended, Open privileged-access requests, Overdue access reviews, Open critical alerts.
  - Row 2: "My tasks" list — approvals awaiting me, access reviews assigned to me, config change requests to review.
  - Row 3: Recent security events widget + Recent configuration changes widget (each links to CPA-S26 / CPA-S24).

## Components & fields
| Component | Type | Notes |
| :---- | :---- | :---- |
| KPI tile | read-only metric | value + delta; click → filtered list screen |
| My-tasks list | data list | grouped by task type; row action = open item |
| Security events widget | mini-table | last N events; “view all” → CPA-S26 |
| Config changes widget | mini-table | last N changes; “view all” → CPA-S24 |
| Scope selector | dropdown | facility/department scope; drives all metrics |

## States
- **Loading**: skeleton tiles + lists.
- **Empty**: “No pending tasks” per section.
- **Permission-denied**: user with no admin permission is redirected to their module home, not here.
- **Error**: per-widget error with retry; one widget failing must not blank the page.

## Actions & RBAC
| Action | Permission |
| :---- | :---- |
| View KPI tile / widget | Data-scoped read for that metric (`dashboard.view`, respects scope) |
| Open a pending approval | The approving permission for that object type |
| Change facility scope | Limited to facilities in the user’s scope |

## Validations & business rules
- Metrics respect user scope and data-masking rules (FR-CPA-DASH-003/009).
- Widgets never show data outside the user’s facility/department scope.

## Audit events
- View of sensitive aggregate widgets may be logged per policy (configurable).

## API needs
- `GET /admin/summary?scope=` → KPI counts.
- `GET /admin/my-tasks` → approvals/reviews/change-requests assigned to user.
- `GET /admin/recent-security-events?scope=` and `GET /admin/recent-config-changes?scope=`.

## Interoperability / FHIR notes
- None directly; widgets read from module services.

## Acceptance criteria
1. A user sees only nav items and tiles their role permits.
2. Changing facility scope refreshes all metrics to that scope.
3. Each “my task” routes to the correct approval/review screen.
4. A failing widget shows an inline error without breaking the page.
