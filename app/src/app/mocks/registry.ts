/**
 * Unified mock registry for the integrated UI conversion app.
 *
 * Streams currently use in-memory fixture `api.ts` helpers (not HTTP). Each
 * stream registers a MockContribution here so the app shell can assert that
 * every stream’s surfaces are accounted for.
 *
 * When a stream migrates to MSW, set `kind: 'msw'` and pass `handlers`.
 * `getMswHandlers()` aggregates them for a single worker (US-G6).
 */
import type { MockContribution, StreamId } from '../stream-contract'

const registry = new Map<StreamId, MockContribution>()

export function registerMockContribution(contribution: MockContribution) {
  registry.set(contribution.stream, contribution)
}

export function getMockContributions(): MockContribution[] {
  return [...registry.values()]
}

export function assertMockCoverage(expected: StreamId[]) {
  const missing = expected.filter((id) => !registry.has(id))
  if (missing.length > 0) {
    console.warn(`[app-shell] mock contributions missing for: ${missing.join(', ')}`)
  }
  return missing
}

/**
 * Aggregate MSW handlers from every stream that registered them.
 * Empty until streams migrate from fixture `api.ts` — callers should still
 * compose against this so new handlers are picked up without editing peers.
 */
export function getMswHandlers(): unknown[] {
  return getMockContributions().flatMap((c) => c.handlers ?? [])
}

/** True when every expected stream has registered (fixture or msw). */
export function hasUnifiedMockService(expected: StreamId[]): boolean {
  return assertMockCoverage(expected).length === 0
}
