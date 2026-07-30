import { GET_STARTED_ARTICLES } from '../articles/get-started'
import { CONTENT_ARTICLES } from '../articles/content'
import { PATTERN_ARTICLES } from '../articles/patterns'
import { SUPPORT_ARTICLES } from '../articles/support'
import { makeArticlePage } from './ArticlePage'

/**
 * Route components for the four written sections. Each resolves `$slug`
 * against its own article list and falls back to that section's overview, so
 * a stale link lands somewhere useful rather than at the site root.
 */
export const GetStartedPage = makeArticlePage(
  GET_STARTED_ARTICLES,
  '/design/get-started/overview',
)
export const ContentPage = makeArticlePage(CONTENT_ARTICLES, '/design/content/overview')
export const PatternsPage = makeArticlePage(PATTERN_ARTICLES, '/design/patterns/overview')
export const SupportPage = makeArticlePage(SUPPORT_ARTICLES, '/design/support/overview')
