// components/tools/marketsManagement.tsx
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  Spinner,
  Code,
} from '@sanity/ui'
import {
  AddIcon,
  EarthGlobeIcon,
  RefreshIcon,
  CheckmarkIcon,
  WarningOutlineIcon,
  InfoOutlineIcon,
} from '@sanity/icons'
import { useEffect, useState } from 'react'
import { Tool } from 'sanity'
import { useRouter } from 'sanity/router'
import {
  getDynamicMarketConfiguration,
  invalidateMarketConfigCache,
  validateMarketConfiguration,
  MarketConfiguration,
} from '../../lib/dynamicMarkets'

function MarketsManagementComponent() {
  const [config, setConfig] = useState<MarketConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [validation, setValidation] = useState<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  } | null>(null)
  const router = useRouter()

  const loadConfiguration = async () => {
    try {
      setLoading(true)
      const [marketConfig, validationResult] = await Promise.all([
        getDynamicMarketConfiguration(),
        validateMarketConfiguration(),
      ])
      setConfig(marketConfig)
      setValidation(validationResult)
    } catch (error) {
      console.error('Error loading market configuration:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshConfiguration = async () => {
    try {
      setRefreshing(true)
      invalidateMarketConfigCache()
      await loadConfiguration()
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadConfiguration()
  }, [])

  const navigateToDocument = (type: string, id?: string) => {
    try {
      if (id) {
        // Navigate to edit existing document
        router.navigateUrl({ path: `/desk/${type};${id}` })
      } else {
        // Navigate to create new document
        router.navigateUrl({ path: `/desk/${type}` })
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback: log the action
      console.log(`Would navigate to ${type}${id ? ` with id ${id}` : ' (new)'}`)
    }
  }

  const getMarketStatus = (market: any) => {
    if (market.languages.length === 0) return { tone: 'critical', text: 'No languages' }
    if (market.languages.length === 1) return { tone: 'caution', text: 'Single language' }
    return { tone: 'positive', text: 'Multi-language' }
  }

  if (loading) {
    return (
      <Container width={4} padding={4}>
        <Card padding={4} tone="transparent">
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text>Loading market configuration...</Text>
          </Flex>
        </Card>
      </Container>
    )
  }

  return (
    <Container width={4} padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Heading size={3}>Markets & Languages Configuration</Heading>
          <Flex gap={2}>
            <Button
              icon={RefreshIcon}
              mode="ghost"
              onClick={refreshConfiguration}
              loading={refreshing}
              text="Refresh"
            />
            <Button
              icon={AddIcon}
              mode="default"
              onClick={() => navigateToDocument('market')}
              text="New Market"
            />
            <Button
              icon={AddIcon}
              mode="ghost"
              onClick={() => navigateToDocument('language')}
              text="New Language"
            />
          </Flex>
        </Flex>

        {/* Configuration Status */}
        <Card padding={3} tone={validation?.isValid ? 'positive' : 'critical'}>
          <Stack space={2}>
            <Flex align="center" gap={2}>
              {validation?.isValid ? <CheckmarkIcon /> : <WarningOutlineIcon />}
              <Text weight="medium">
                Configuration Status: {validation?.isValid ? '✅ Valid' : '❌ Invalid'}
              </Text>
            </Flex>

            {validation?.errors && validation.errors.length > 0 && (
              <Box>
                <Text size={1} weight="medium">
                  Errors:
                </Text>
                {validation.errors.map((error, index) => (
                  <Text key={index} size={1} style={{ color: 'red' }}>
                    • {error}
                  </Text>
                ))}
              </Box>
            )}

            {validation?.warnings && validation.warnings.length > 0 && (
              <Box>
                <Text size={1} weight="medium">
                  Warnings:
                </Text>
                {validation.warnings.map((warning, index) => (
                  <Text key={index} size={1} style={{ color: 'orange' }}>
                    • {warning}
                  </Text>
                ))}
              </Box>
            )}
          </Stack>
        </Card>

        {/* Quick Actions */}
        <Card padding={3} tone="transparent" border>
          <Stack space={3}>
            <Text weight="medium" size={1}>
              Quick Actions
            </Text>
            <Flex gap={2} wrap="wrap">
              <Button
                mode="ghost"
                text="View All Markets"
                onClick={() => router.navigateUrl({ path: '/desk/market' })}
              />
              <Button
                mode="ghost"
                text="View All Languages"
                onClick={() => router.navigateUrl({ path: '/desk/language' })}
              />
              <Button
                mode="ghost"
                text="Workspace Settings"
                onClick={() => router.navigateUrl({ path: '/desk' })}
              />
            </Flex>
          </Stack>
        </Card>

        {/* Markets Overview */}
        <Stack space={3}>
          <Heading size={2}>Markets ({config?.markets.length || 0})</Heading>
          {config?.markets && config.markets.length > 0 ? (
            config.markets.map((market) => {
              const status = getMarketStatus(market)
              return (
                <Card key={market.name} padding={3} border>
                  <Stack space={3}>
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap={2}>
                        <Text weight="semibold" size={2}>
                          {market.title} ({market.name})
                        </Text>
                        <Badge tone={status.tone as any}>{status.text}</Badge>
                      </Flex>
                      <Button
                        mode="ghost"
                        onClick={() => navigateToDocument('market', market.name.toLowerCase())}
                        text="Edit"
                      />
                    </Flex>
                    <Flex gap={2} wrap="wrap">
                      {market.languages.map((lang) => (
                        <Badge key={lang.id} tone="primary">
                          {lang.title} ({lang.id})
                        </Badge>
                      ))}
                      {market.languages.length === 0 && (
                        <Text size={1} muted>
                          No languages configured
                        </Text>
                      )}
                    </Flex>
                  </Stack>
                </Card>
              )
            })
          ) : (
            <Card padding={4} tone="caution">
              <Text>
                No markets configured. Create your first market to get started with
                internationalization.
              </Text>
            </Card>
          )}
        </Stack>

        {/* Languages Overview */}
        <Stack space={3}>
          <Heading size={2}>All Languages ({config?.uniqueLanguages.length || 0})</Heading>
          <Card padding={3} border>
            <Stack space={2}>
              <Flex gap={2} wrap="wrap">
                {config?.uniqueLanguages && config.uniqueLanguages.length > 0 ? (
                  config.uniqueLanguages.map((lang) => (
                    <Badge key={lang.id} tone="default">
                      {lang.title} ({lang.id})
                    </Badge>
                  ))
                ) : (
                  <Text muted>No languages configured</Text>
                )}
              </Flex>
              {config?.uniqueLanguages && config.uniqueLanguages.length > 0 && (
                <Text size={1} muted>
                  These languages are available across all markets and can be used for content
                  localization.
                </Text>
              )}
            </Stack>
          </Card>
        </Stack>

        {/* Configuration Details */}
        <Card padding={3} tone="transparent" border>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <InfoOutlineIcon />
              <Text weight="medium" size={1}>
                Configuration Details
              </Text>
            </Flex>
            <Text size={1} muted>
              This configuration is dynamically loaded from your Sanity dataset. Changes to markets
              and languages will automatically update your Studio configuration.
            </Text>
            <Stack space={2}>
              <Text size={1} muted>
                • Markets: {config?.markets.length || 0}
              </Text>
              <Text size={1} muted>
                • Unique Languages: {config?.uniqueLanguages.length || 0}
              </Text>
              <Text size={1} muted>
                • Total Market-Language Combinations:{' '}
                {config?.markets.reduce((acc, market) => acc + market.languages.length, 0) || 0}
              </Text>
            </Stack>

            {/* Development Info */}
            <Stack space={2}>
              <Text size={1} weight="medium">
                Development Commands:
              </Text>
              <Code size={1}>npm run test-config</Code>
              <Code size={1}>npm run validate-markets</Code>
              <Code size={1}>npm run check-markets</Code>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}

// Export as a tool
export const marketsManagementTool: Tool = {
  name: 'markets-management',
  title: 'Markets & Languages',
  icon: EarthGlobeIcon,
  component: MarketsManagementComponent,
}
