---
name: verify
description: Build, run, and drive the Rednoxx design-system showcase to verify UI changes at the surface (screenshots + DOM assertions).
---

# Verifying changes in this repo

Single Vite + React app in `app/`, driven from the repo root.

## Build / launch

```bash
npm run build        # type-check + production build (root script, runs in app/)
npm run dev          # Vite dev server — picks the next free port if 5173 is taken;
                     # read the actual port from its output before driving
```

## Drive (headless Chrome)

No Playwright in the repo. Install `playwright-core` in the session scratchpad
(`npm i playwright-core`) and launch the system Chrome — no browser download needed:

```js
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
```

## Routes worth driving

- `/` — Overview: layer cards, component + block index cards (static previews from `src/showcase/pages/previews.tsx`)
- `/components/<slug>` — live component examples (slugs in `src/showcase/docs/*.tsx`)
- `/blocks/<slug>` — live block examples (slugs in `src/showcase/blocks-meta.ts`, bodies in `src/showcase/blockdocs/`)
- `/demo/sign-in` — demo auth flow (`/demo` alone does NOT show sign-in). Demo password `rednoxx`, OTP `424242`
- `/demo/overview` etc. — the 13 demo screens

## Gotchas

- `Field` wraps controls in a real `<label>`, so `page.getByLabel('Password')` works.
- All data is mocked (`src/showcase/health.ts`); no backend to set up.
- Lint (`npm run lint`) has pre-existing `react(only-export-components)` warnings — not regressions.
