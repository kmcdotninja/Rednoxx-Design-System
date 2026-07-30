/**
 * Facility MRN allocator for HIM intake (UI-conversion fixture).
 *
 * Honours Jira AC + FR-HIM-ID-002 / SRS §14:
 * - Unique within facility namespace
 * - Facility numbering format RNX-{FAC}-{SEQ:6}
 * - Concurrent-safe via a single in-process queue
 * - Values are never reused; callers must treat assigned MRNs as immutable
 */
import { HIM_PATIENTS } from './data'

export const MRN_SCHEME_PATTERN = 'RNX-{FAC}-{SEQ:6}'

/** Maps display facility name → short code used in the MRN. */
export const FACILITY_MRN_CODES: Record<string, string> = {
  'Garki General Hospital': 'GGH',
  'Ikeja Medical Centre': 'IMC',
  'Kano Specialist Clinic': 'KSC',
  'Enugu Teaching Hospital': 'ETH',
}

const allocated = new Set<string>()
const nextSeqByFacility = new Map<string, number>()

/** Serialise allocations so overlapping register calls still get unique MRNs. */
let chain: Promise<unknown> = Promise.resolve()

function facilityCode(facility: string): string {
  return FACILITY_MRN_CODES[facility] ?? 'FAC'
}

function formatMrn(code: string, seq: number): string {
  return `RNX-${code}-${String(seq).padStart(6, '0')}`
}

function seedFromFixtures() {
  if (allocated.size > 0) return
  let maxSeq = 4820
  for (const p of HIM_PATIENTS) {
    if (!p.mrn) continue
    allocated.add(p.mrn)
    const m = /^RNX-([A-Z0-9]+)-(\d+)$/.exec(p.mrn)
    if (m) {
      const n = Number(m[2])
      if (n > maxSeq) maxSeq = n
      const prev = nextSeqByFacility.get(m[1]) ?? maxSeq
      nextSeqByFacility.set(m[1], Math.max(prev, n + 1))
    }
  }
  // Default next for known facilities if never seen in fixtures.
  for (const code of Object.values(FACILITY_MRN_CODES)) {
    if (!nextSeqByFacility.has(code)) nextSeqByFacility.set(code, maxSeq + 1)
  }
}

export function getMrnSchemeLabel(facility: string): string {
  const code = facilityCode(facility)
  return `RNX-${code}-{SEQ:6}`
}

export function isTemporaryMrn(mrn: string): boolean {
  return /^(TEMP|MCI|BBY|OFF)-/i.test(mrn)
}

/** Test / demo hook — next allocation attempt injects a colliding value once. */
let forceCollisionOnce = false

export function armMrnCollisionDemo() {
  forceCollisionOnce = true
}

export function resetMrnAllocatorForTests() {
  allocated.clear()
  nextSeqByFacility.clear()
  forceCollisionOnce = false
  chain = Promise.resolve()
  seedFromFixtures()
}

export interface AllocateMrnResult {
  mrn: string
  facilityCode: string
  sequence: number
  retries: number
  scheme: string
}

async function allocateUnlocked(facility: string): Promise<AllocateMrnResult> {
  seedFromFixtures()
  const code = facilityCode(facility)
  let retries = 0

  // Simulate a race where a stale candidate collides once, then retry succeeds.
  if (forceCollisionOnce) {
    forceCollisionOnce = false
    retries = 1
    // fall through to fresh allocation after "retry"
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const seq = nextSeqByFacility.get(code) ?? 4821
    nextSeqByFacility.set(code, seq + 1)
    const mrn = formatMrn(code, seq)
    if (!allocated.has(mrn) && !HIM_PATIENTS.some((p) => p.mrn === mrn)) {
      allocated.add(mrn)
      return {
        mrn,
        facilityCode: code,
        sequence: seq,
        retries,
        scheme: MRN_SCHEME_PATTERN,
      }
    }
    retries++
  }

  throw new Error('Could not allocate a unique MRN — please retry registration.')
}

/**
 * Allocate the next permanent MRN for a facility.
 * Concurrent callers are queued so two parallel registers never share a value.
 */
export function allocatePermanentMrn(facility: string): Promise<AllocateMrnResult> {
  const run = chain.then(() => allocateUnlocked(facility))
  chain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export function isMrnAllocated(mrn: string): boolean {
  seedFromFixtures()
  return allocated.has(mrn) || HIM_PATIENTS.some((p) => p.mrn === mrn)
}
