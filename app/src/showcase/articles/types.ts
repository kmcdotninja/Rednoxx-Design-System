/**
 * Written documentation — Get started, Content, Patterns and Support — is
 * authored as data rather than one .tsx per page. Every page shares the same
 * renderer, so the section reads consistently and a new page is a data entry,
 * not a component.
 *
 * Live, token-driven pages (Foundations) stay as real components; only prose
 * lives here.
 */

export type ArticleBlock =
  /** Section heading inside the article. */
  | { kind: 'h'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  /** Numbered sequence — anatomy of a pattern, order of operations. */
  | { kind: 'steps'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'code'; code: string; label?: string }
  | { kind: 'callout'; tone: 'info' | 'warn' | 'danger' | 'success'; title: string; text: string }
  /** Paired guidance. Both columns are optional so one side can stand alone. */
  | { kind: 'dodont'; do?: string[]; dont?: string[] }

export interface Article {
  slug: string
  title: string
  /** One line under the title; also used on section overviews. */
  summary: string
  blocks: ArticleBlock[]
  /** Repo path this page is derived from, shown as a provenance footer. */
  source?: string
}

export type ArticleSection = 'get-started' | 'content' | 'patterns' | 'support'

export function articleBySlug(articles: Article[], slug: string | undefined) {
  return articles.find((a) => a.slug === slug)
}
