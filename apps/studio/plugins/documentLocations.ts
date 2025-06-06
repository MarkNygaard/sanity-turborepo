import { defineLocations } from 'sanity/presentation'

/**
 * Document Locations Configuration for DILLING
 *
 * This module exports just the locations configuration to be used
 * within the presentation tool, keeping configuration centralized.
 */

// Document locations configuration (no presentation tool wrapper)
export const documentLocationsConfig = {
  // Home Pages - market specific
  homePage: defineLocations({
    select: {
      title: 'title',
      language: 'language',
      market: 'market',
    },
    resolve: (doc) => {
      if (!doc) return { locations: [] }

      return {
        locations: [
          {
            title: `${doc.title || 'Home Page'} (${doc.language?.toUpperCase() || 'EN'})`,
            href: `/${doc.language || 'en'}`,
          },
        ],
      }
    },
  }),

  // Regular Pages - with slug and language
  page: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language',
      market: 'market',
    },
    resolve: (doc) => {
      if (!doc?.slug) return { locations: [] }

      return {
        locations: [
          {
            title: `${doc.title || 'Untitled Page'} (${doc.language?.toUpperCase() || 'EN'})`,
            href: `/${doc.language || 'en'}/${doc.slug}`,
          },
        ],
      }
    },
  }),

  // Settings - used across the site
  settings: defineLocations({
    select: {
      siteTitle: 'siteTitle',
      language: 'language',
      market: 'market',
    },
    resolve: (doc) => {
      if (!doc) return { locations: [] }

      return {
        locations: [
          {
            title: `Site Settings (${doc.language?.toUpperCase() || 'EN'})`,
            href: `/${doc.language || 'en'}`,
          },
        ],
        message: 'This document is used on all pages',
        tone: 'positive',
      }
    },
  }),

  // Navigation - used in header
  navigation: defineLocations({
    select: {
      label: 'label',
      language: 'language',
      market: 'market',
    },
    resolve: (doc) => {
      if (!doc?.language) return { locations: [] }

      return {
        locations: [
          {
            title: `Site Navigation (${doc.language.toUpperCase()})`,
            href: `/${doc.language}`,
          },
        ],
        message: 'This document is used on all pages',
        tone: 'positive',
      }
    },
  }),

  // Footer - used site-wide
  footer: defineLocations({
    select: {
      label: 'label',
      language: 'language',
      market: 'market',
    },
    resolve: (doc) => {
      if (!doc?.language) return { locations: [] }

      return {
        locations: [
          {
            title: `Site Footer (${doc.language.toUpperCase()})`,
            href: `/${doc.language}`,
          },
        ],
        message: 'This document is used on all pages',
        tone: 'positive',
      }
    },
  }),

  // Languages - show where this language is available
  language: defineLocations({
    select: {
      title: 'title',
      code: 'code',
      isDefault: 'isDefault',
    },
    resolve: (doc) => {
      if (!doc?.code) return { locations: [] }

      return {
        locations: [
          {
            title: `Language Homepage (${doc.title})`,
            href: `/${doc.code}`,
          },
          // Show default language indicator
          ...(doc.isDefault
            ? [
                {
                  title: 'Default Language Site',
                  href: '/',
                },
              ]
            : []),
          {
            title: `Browse ${doc.title} Content`,
            href: `/${doc.code}`,
          },
        ],
      }
    },
  }),

  // Markets - show where this market's content appears
  market: defineLocations({
    select: {
      title: 'title',
      code: 'code',
      languages: 'languages[]->{ code, title, isDefault }',
    },
    resolve: (doc) => {
      if (!doc?.languages?.length) return { locations: [] }

      return {
        locations: doc.languages.map((lang: any) => ({
          title: `${doc.title} Market - ${lang.title} Homepage`,
          href: `/${lang.code}`,
        })),
      }
    },
  }),

  // Person documents - show in personal dashboard
  person: defineLocations({
    select: {
      name: 'name',
      userId: 'userId',
    },
    resolve: (doc) => {
      if (!doc) return { locations: [] }

      return {
        locations: [
          {
            title: 'Personal Dashboard',
            href: '/studio/personal-dashboard',
          },
          {
            title: 'User Profile & Bookmarks',
            href: '/studio/personal-dashboard',
          },
        ],
      }
    },
  }),
}

// Main document resolvers configuration
export const mainDocumentResolvers = [
  // Home pages
  {
    route: '/:language',
    filter: '_type == "homePage" && language == $language',
  },
  // Regular pages
  {
    route: '/:language/:slug',
    filter: '_type == "page" && slug.current == $slug && language == $language',
  },
]

// Market-specific document resolvers
export function getMarketDocumentResolvers(market: any) {
  return [
    ...mainDocumentResolvers,
    // Market-specific routes (if needed for your setup)
    {
      route: `/:language`,
      filter: `_type == "homePage" && language == $language && market == "${market.code}"`,
    },
    {
      route: `/:language/:slug`,
      filter: `_type == "page" && slug.current == $slug && language == $language && market == "${market.code}"`,
    },
  ]
}
