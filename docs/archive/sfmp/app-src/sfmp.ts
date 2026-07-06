import type { FacilityType, Project, ProjectStatus, Sector } from '@/data/types'

/* -------------------- sector / facility-type lookups ---------------------- */

export function sectorById(sectors: Sector[], id: string): Sector | undefined {
  return sectors.find((s) => s.id === id)
}

export function facilityTypeById(sectors: Sector[], id: string): FacilityType | undefined {
  for (const s of sectors) {
    const ft = s.facilityTypes.find((f) => f.id === id)
    if (ft) return ft
  }
  return undefined
}

export function facilityTypeName(sectors: Sector[], id: string): string {
  return facilityTypeById(sectors, id)?.name ?? 'Facility type'
}

/* ------------------------------- statuses --------------------------------- */

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  in_progress: 'In progress',
  on_marketplace: 'On marketplace',
  recommended: 'Recommended',
  selected: 'Selected',
  accepted: 'Accepted',
  rejected: 'Rejected',
}

/** Tone key understood by <StatusPill>. */
export const PROJECT_STATUS_TONE: Record<ProjectStatus, string> = {
  in_progress: 'pending',
  on_marketplace: 'info',
  recommended: 'lime',
  selected: 'lime',
  accepted: 'success',
  rejected: 'danger',
}

/* ----------------------------- project filters ---------------------------- */

export function borrowerProjects(projects: Project[], company: string): Project[] {
  return projects.filter((p) => p.borrower === company)
}

/** Projects a financier can see on the marketplace (recommended, not yet taken). */
export function marketplaceProjects(projects: Project[]): Project[] {
  return projects.filter((p) => p.status === 'recommended')
}

export function financierProjects(projects: Project[], company: string): Project[] {
  return projects.filter((p) => p.financier === company)
}

export function sum(projects: Project[], pick: (p: Project) => number = (p) => p.amount): number {
  return projects.reduce((acc, p) => acc + pick(p), 0)
}

/* ------------------------ document-section helpers ------------------------ */

/** Count of document sections filled for a project (across its facility type). */
export function docsProgress(project: Project, ft?: FacilityType): { filled: number; total: number } {
  if (!ft) return { filled: 0, total: 0 }
  const total = ft.documentSections.length
  const filled = ft.documentSections.filter((s) => (project.documents[s.id]?.length ?? 0) > 0).length
  return { filled, total }
}
