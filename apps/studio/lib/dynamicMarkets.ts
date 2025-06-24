// lib/dynamicMarkets.ts
import { createClient } from '@sanity/client'
import groq from 'groq'
import { dataset, projectId, apiVersion } from './api'

export interface MarketLanguage {
  id: string
  title: string
}

export interface DynamicMarket {
  name: string
  title: string
  languages: MarketLanguage[]
}

export interface MarketConfiguration {
  markets: DynamicMarket[]
  uniqueLanguages: MarketLanguage[]
}

// Create a client for fetching configuration
const configClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion,
  perspective: 'published',
})

let cachedConfig: MarketConfiguration | null = null
let configPromise: Promise<MarketConfiguration> | null = null

export async function getDynamicMarketConfiguration(): Promise<MarketConfiguration> {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig
  }

  // Return existing promise if already loading
  if (configPromise) {
    return configPromise
  }

  // Create new promise to load config
  configPromise = loadMarketConfiguration()
    .then((config) => {
      cachedConfig = config
      configPromise = null
      return config
    })
    .catch((error) => {
      configPromise = null
      console.error('Failed to load market configuration:', error)
      // Return fallback configuration
      return getFallbackConfiguration()
    })

  return configPromise
}

async function loadMarketConfiguration(): Promise<MarketConfiguration> {
  try {
    const query = groq`{
      "markets": *[_type == "market" && !(_id in path("drafts.**"))]|order(title asc) {
        _id,
        title,
        code,
        flag,
        flagCode,
        "languages": languages[]->{
          code,
          title,
          _id,
          isDefault
        }
      }
    }`

    const data = await configClient.fetch(query)

    if (!data?.markets || !Array.isArray(data.markets)) {
      console.warn('No markets found in dataset, using fallback configuration')
      return getFallbackConfiguration()
    }

    const markets: DynamicMarket[] = data.markets.map((market: any) => ({
      name: market.code.toUpperCase(),
      title: market.title,
      languages:
        market.languages?.map((lang: any) => ({
          id: lang.code,
          title: lang.title,
        })) || [],
    }))

    // Filter out markets without languages
    const validMarkets = markets.filter((market) => market.languages.length > 0)

    if (validMarkets.length === 0) {
      console.warn('No markets with languages found, using fallback configuration')
      return getFallbackConfiguration()
    }

    const uniqueLanguages = Array.from(
      new Map(
        validMarkets.flatMap((market) => market.languages).map((lang) => [lang.id, lang]),
      ).values(),
    )

    console.log(`✅ Loaded ${validMarkets.length} markets with ${uniqueLanguages.length} languages`)

    return {
      markets: validMarkets,
      uniqueLanguages,
    }
  } catch (error) {
    console.error('Error fetching market configuration:', error)
    throw error
  }
}

function getFallbackConfiguration(): MarketConfiguration {
  console.warn('Using fallback market configuration')
  return {
    markets: [
      {
        name: 'EU',
        title: 'European Union',
        languages: [
          { id: 'da', title: 'Danish' },
          { id: 'en', title: 'English' },
        ],
      },
    ],
    uniqueLanguages: [
      { id: 'da', title: 'Danish' },
      { id: 'en', title: 'English' },
    ],
  }
}

// Cache invalidation function
export function invalidateMarketConfigCache(): void {
  cachedConfig = null
  configPromise = null
}

// Validation helper
export async function validateMarketConfiguration(): Promise<{
  isValid: boolean
  errors: string[]
  warnings: string[]
}> {
  try {
    const config = await getDynamicMarketConfiguration()
    const errors: string[] = []
    const warnings: string[] = []

    // Check if we have markets
    if (config.markets.length === 0) {
      errors.push('No markets configured')
    }

    // Check that each market has at least one language
    const marketsWithoutLanguages = config.markets.filter((market) => market.languages.length === 0)

    if (marketsWithoutLanguages.length > 0) {
      errors.push(
        `Markets without languages: ${marketsWithoutLanguages.map((m) => m.name).join(', ')}`,
      )
    }

    // Check for markets with only one language (might want internationalization)
    const singleLanguageMarkets = config.markets.filter((market) => market.languages.length === 1)

    if (singleLanguageMarkets.length > 0) {
      warnings.push(
        `Single language markets: ${singleLanguageMarkets.map((m) => m.name).join(', ')}`,
      )
    }

    const isValid = errors.length === 0

    if (isValid) {
      console.log(
        `✅ Configuration valid: ${config.markets.length} markets, ${config.uniqueLanguages.length} languages`,
      )
    } else {
      console.error('❌ Configuration validation failed:', errors)
    }

    return { isValid, errors, warnings }
  } catch (error) {
    return {
      isValid: false,
      errors: [
        `Configuration validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
      warnings: [],
    }
  }
}

// Watch for changes (useful in development)
export function watchMarketConfiguration(
  callback: (config: MarketConfiguration) => void,
): () => void {
  const query = groq`*[_type in ["market", "language"]]`

  const subscription = configClient.listen(query).subscribe({
    next: async () => {
      try {
        invalidateMarketConfigCache()
        const config = await getDynamicMarketConfiguration()
        callback(config)
      } catch (error) {
        console.error('Error in market configuration watcher:', error)
      }
    },
    error: (error: Error) => {
      console.error('Market configuration watcher error:', error)
    },
  })

  return () => subscription.unsubscribe()
}
