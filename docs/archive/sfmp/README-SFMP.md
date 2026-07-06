# SFMP — Sustainable Finance Marketplace

A renewable-energy **structured-finance lending marketplace** connecting three
interfaces — **Borrowers**, **Financiers** and the **SFMP Admin** (platform
operator) — under a banking **maker-checker** model (Root / Initiator /
Authorizer per interface). *Proudly Powered by Sterling Bank.*

> A borrower onboards → creates a **Project** (a financing request with a
> facility-type document pack) → the project is published to the
> **Marketplace** → Admin reviews and **recommends** it → **Financiers**
> select, then **accept or reject** → an **acceptance checklist** and
> repayment terms are agreed.

## Repository layout

| Path | What it is |
|---|---|
| [`app/`](app/) | The SFMP web app (React + TypeScript + Vite + Tailwind v4) — see [`app/README.md`](app/README.md) |
| [`User_Story_SFMP.md`](User_Story_SFMP.md) | Approved user-story suite — branding & onboarding enhancement |
| [`SFMP-Frontend-Documentation.md`](SFMP-Frontend-Documentation.md) | Full product & engineering reference documentation |
| [`docs/archive/`](docs/archive/) | Docs from the previous project this repo was adapted from |

## Quick start

```bash
npm run setup   # install app dependencies
npm run dev     # http://localhost:5173
npm run build   # type-check + production build
npm run lint    # oxlint
```

## Product highlights (per the user stories)

- **Facility types** (Renewable Energy): Solar Home System, Commercial & Industrial,
  Isolated Mini Grid, Interconnected Mini Grid — each with nomenclature tooltips and a
  **facility-type-specific mandatory document pack** ("Others" allows multiple uploads).
- **Equity contribution ≥ 20%** enforced with the "enter a value from 20" message.
- **Draft auto-save**: in-progress applications are stored under Projects with an
  *in progress* state.
- **Admin sector configuration**: create sectors, add facility types (Add More),
  typed fields (Text / Document / Number / Percentage) with a combo Section selector —
  all gated by **authorizer approval** before reaching borrower views.
- **Messages**: Inbox/Sent with **value-based search**, **date filter** and pagination.
- **Approvals queue**, **audit trail**, **user (persona) management**, **communities
  lending**, advisory **meetings**, 2FA via **Sterling OneToken**, and a 5-minute
  inactivity session timeout.
