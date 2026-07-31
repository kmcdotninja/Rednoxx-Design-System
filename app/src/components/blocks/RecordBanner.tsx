import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Avatar, Card } from '@/components/ui'

/**
 * Generic record identity banner — the wrong-patient safety control at the top
 * of a record screen, with every slot composed by the caller.
 *
 * Use this when the screen's record is NOT the demo `Patient`/`PatientBio`
 * shape (HIM records, registration, any module with its own domain type):
 * the caller supplies the status pill, identifier line and tags, so modules
 * share one banner instead of each forking their own. For the Care demo chart,
 * which has the full `Patient` + `PatientBio` pair (and sensitive-field
 * masking), use PatientBanner instead.
 */
export function RecordBanner({
  name,
  nameAs: Name = 'h1',
  avatarName,
  status,
  identifiers,
  allergies,
  tags,
  actions,
}: {
  /** Full name — the largest element, rendered as the page h1. */
  name: string
  /**
   * Element for the name. `h1` on a record screen, where the patient IS the
   * page. Drop to `p` when the banner is a specimen inside a page that already
   * owns its heading — a docs example or the case-study gallery.
   */
  nameAs?: 'h1' | 'h2' | 'p'
  /** Overrides the avatar's initials source (defaults to `name`). */
  avatarName?: string
  /** Status pill node (e.g. <StatusPill/> or a module's RecordStatusPill). */
  status?: ReactNode
  /** Demographic/identifier line: age · DOB · sex · MRN — the caller composes it. */
  identifiers?: ReactNode
  /** Allergy labels — always-visible danger pills, never hidden behind a click. */
  allergies?: string[]
  /** Coverage / category tags (<Tag/> nodes). */
  tags?: ReactNode
  /** Right-aligned primary actions for the record. */
  actions?: ReactNode
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar name={avatarName ?? name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <Name className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-forest">
                {name}
              </Name>
              {status}
              {/* Allergy flags stay visible at all times — never behind a click. */}
              {allergies?.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center gap-1 rounded-full bg-rose-soft px-2 py-0.5 text-[11px] font-medium text-rose-ink"
                >
                  <TriangleAlert size={11} aria-hidden />
                  Allergy: {allergy}
                </span>
              ))}
            </div>
            {identifiers && <p className="tnum mt-1 text-[13px] text-forest-400">{identifiers}</p>}
            {tags && <div className="mt-2 flex flex-wrap items-center gap-1.5">{tags}</div>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </Card>
  )
}
