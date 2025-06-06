import { Badge, Card, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType, useEffect, useState } from 'react'
import { StringInputProps, useClient, useFormValue, PatchEvent, set } from 'sanity'
import groq from 'groq'

interface MarketWithLanguages {
  _id: string
  title: string
  code: string
  languages: Array<{
    code: string
    title: string
    _id: string
    isDefault?: boolean
  }>
}

const SmartMarketField: ComponentType<StringInputProps> = (props) => {
  const client = useClient({ apiVersion: '2025-03-01' })
  const [markets, setMarkets] = useState<MarketWithLanguages[]>([])
  const [loading, setLoading] = useState(true)
  const [availableMarkets, setAvailableMarkets] = useState<MarketWithLanguages[]>([])
  const [autoUpdated, setAutoUpdated] = useState(false)

  // Get the current language from the form
  const language = useFormValue(['language']) as string
  const currentMarket = props.value

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true)
        const query = groq`*[_type == "market"]|order(title asc) {
          _id,
          title,
          code,
          languages[]->{
            code,
            title,
            _id,
            isDefault
          }
        }`

        const result = await client.fetch<MarketWithLanguages[]>(query)
        setMarkets(result)
      } catch (error) {
        console.error('Error fetching markets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarkets()
  }, [client])

  useEffect(() => {
    if (!language || markets.length === 0) {
      setAvailableMarkets([])
      return
    }

    // Find markets that have this language
    const marketsWithLanguage = markets.filter((market) =>
      market.languages?.some((lang) => lang.code === language),
    )

    setAvailableMarkets(marketsWithLanguage)

    // Auto-update market if language is only available in one market
    if (marketsWithLanguage.length === 1 && currentMarket !== marketsWithLanguage[0].code) {
      const newMarket = marketsWithLanguage[0].code
      props.onChange(PatchEvent.from(set(newMarket)))
      setAutoUpdated(true)

      // Clear the auto-updated state after a few seconds
      setTimeout(() => setAutoUpdated(false), 3000)
    }
  }, [language, markets, currentMarket, props])

  if (loading) {
    return (
      <Card padding={3} tone="transparent" border>
        <Text size={1} muted>
          Loading markets...
        </Text>
      </Card>
    )
  }

  if (!language) {
    return (
      <Card padding={3} tone="caution" border>
        <Text size={1}>Please select a language first to determine available markets</Text>
      </Card>
    )
  }

  if (availableMarkets.length === 0) {
    return (
      <Card padding={3} tone="critical" border>
        <Text size={1}>
          ⚠️ Language "{language}" is not configured in any market. Please add this language to a
          market first.
        </Text>
      </Card>
    )
  }

  if (availableMarkets.length === 1) {
    const market = availableMarkets[0]
    return (
      <Card padding={3} tone={autoUpdated ? 'positive' : 'primary'} border>
        <Flex align="center" justify="space-between">
          <Stack space={2}>
            <Text size={1} weight="medium">
              {market.title} ({market.code})
            </Text>
            <Text size={0} muted>
              {autoUpdated
                ? '✅ Automatically set - this language is only available in this market'
                : 'This language is only available in this market'}
            </Text>
          </Stack>
          <Badge tone="positive" fontSize={0}>
            Auto-assigned
          </Badge>
        </Flex>
      </Card>
    )
  }

  // Multiple markets available - show dropdown
  return (
    <Card padding={2} border>
      <Stack space={2}>
        <Text size={0} muted>
          Language "{language}" is available in multiple markets. Please select one:
        </Text>
        <Stack space={1}>
          {availableMarkets.map((market) => (
            <Card
              key={market._id}
              padding={3}
              tone={currentMarket === market.code ? 'primary' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => props.onChange(PatchEvent.from(set(market.code)))}
            >
              <Flex align="center" justify="space-between">
                <Stack space={1}>
                  <Text size={1} weight={currentMarket === market.code ? 'medium' : 'regular'}>
                    {market.title} ({market.code})
                  </Text>
                  <Text size={0} muted>
                    {market.languages.length} language{market.languages.length !== 1 ? 's' : ''}{' '}
                    available
                  </Text>
                </Stack>
                {currentMarket === market.code && (
                  <Badge tone="primary" fontSize={0}>
                    Selected
                  </Badge>
                )}
              </Flex>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

export default SmartMarketField
