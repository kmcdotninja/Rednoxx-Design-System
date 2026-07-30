import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import './app/providers' // register global query client, router, etc.

// The product repo boots MSW here (`app/mocks/browser.ts`); every ported
// stream runs on in-memory fixtures, so this port renders directly.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
