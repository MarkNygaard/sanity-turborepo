import { SlugValidationContext } from 'sanity'

/**
 * Custom isUnique function for slugs that allows same slug across different languages
 * but prevents duplicates within the same language
 */
export const isUniqueSlugPerLanguage = (slug: string, context: SlugValidationContext) => {
  const { document, defaultIsUnique } = context

  if (!document?.language) {
    // Fall back to default behavior if no language is set
    return defaultIsUnique(slug, context)
  }

  // Get both the draft and published IDs for the current document
  const currentId = document._id?.replace('drafts.', '')
  const draftId = `drafts.${currentId}`

  // Check uniqueness within the same language only, excluding both draft and published versions of current doc
  const query = `*[
    _type == "page" 
    && slug.current == $slug 
    && language == $language 
    && _id != $currentId
    && _id != $draftId
  ]`

  const params = {
    slug,
    language: document.language,
    currentId,
    draftId,
  }

  return context
    .getClient({ apiVersion: '2025-03-01' })
    .fetch(`count(${query})`, params)
    .then((count: number) => count === 0)
}
