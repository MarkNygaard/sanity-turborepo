import { Badge, Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType, useEffect, useState } from 'react'
import { TbExternalLink, TbMap2, TbUser, TbWorld } from 'react-icons/tb'
import { useClient } from 'sanity'
import groq from 'groq'
import { apiVersion } from '../../../lib/api'

interface DocumentUsage {
  referencingPages: Array<{
    _id: string
    title: string
    language: string
    market: string
    slug: { current: string }
  }>
  referencingHomePages: Array<{
    _id: string
    title: string
    language: string
    market: string
  }>
  bookmarkedBy: Array<{
    _id: string
    name: string
  }>
  usedInNavigation: Array<{
    _id: string
    label: string
    language: string
    market: string
  }>
  usedInFooter: Array<{
    _id: string
    label: string
    language: string
    market: string
  }>
  contextualUsage?: {
    type: 'navigation' | 'footer'
    language: string
    allPages: Array<{
      _id: string
      title: string
      language: string
      slug: { current: string }
    }>
    homePage: {
      _id: string
      title: string
      language: string
    } | null
  }
}

interface DocumentUsageDisplayProps {
  documentId: string
  documentType: string
}

const DocumentUsageDisplay: ComponentType<DocumentUsageDisplayProps> = ({
  documentId,
  documentType,
}) => {
  const client = useClient({ apiVersion })
  const [usage, setUsage] = useState<DocumentUsage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!documentId) return

    const fetchUsage = async () => {
      try {
        setLoading(true)

        const usageQuery = groq`{
          "referencingPages": *[references($docId) && _type == "page"]{
            _id,
            title,
            language,
            market,
            slug
          },
          "referencingHomePages": *[references($docId) && _type == "homePage"]{
            _id,
            title,
            language,
            market
          },
          "bookmarkedBy": *[_type == "person" && bookmarks[].reference._ref == $docId]{
            _id,
            name
          },
          "usedInNavigation": *[_type == "navigation" && references($docId)]{
            _id,
            label,
            language,
            market
          },
          "usedInFooter": *[_type == "footer" && references($docId)]{
            _id,
            label,
            language,
            market
          },
          "allPagesInLanguage": *[_type == "page" && language == $language]{
            _id,
            title,
            language,
            slug
          }[0...20],
          "homePageInLanguage": *[_type == "homePage" && language == $language][0]{
            _id,
            title,
            language
          }
        }`

        // Get the document to check its language for navigation/footer context
        const docQuery = groq`*[_id == $docId][0]{ _type, language }`
        const document = await client.fetch(docQuery, { docId: documentId })

        const result = await client.fetch<
          DocumentUsage & {
            allPagesInLanguage: Array<{
              _id: string
              title: string
              language: string
              slug: { current: string }
            }>
            homePageInLanguage: { _id: string; title: string; language: string } | null
          }
        >(usageQuery, {
          docId: documentId,
          language: document?.language || 'en',
        })

        // For navigation and footer, add site-wide usage context
        if (document?._type === 'navigation' || document?._type === 'footer') {
          result.contextualUsage = {
            type: document._type,
            language: document.language,
            allPages: result.allPagesInLanguage,
            homePage: result.homePageInLanguage,
          }
        }

        setUsage(result)
      } catch (error) {
        console.error('Error fetching document usage:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsage()
  }, [documentId, client])

  if (loading) {
    return (
      <Card padding={4}>
        <Text>Loading usage information...</Text>
      </Card>
    )
  }

  if (!usage) {
    return (
      <Card padding={4}>
        <Text>Unable to load usage information</Text>
      </Card>
    )
  }

  const totalUsages =
    usage.referencingPages.length +
    usage.referencingHomePages.length +
    usage.usedInNavigation.length +
    usage.usedInFooter.length

  return (
    <Stack space={4}>
      <Card padding={4} tone="primary">
        <Flex align="center" gap={3}>
          <TbExternalLink size={20} />
          <Text weight="semibold">Document Usage Overview</Text>
          <Badge tone={totalUsages > 0 ? 'positive' : 'default'}>
            {totalUsages} location{totalUsages !== 1 ? 's' : ''}
          </Badge>
        </Flex>
      </Card>

      {/* Site-wide Usage for Navigation/Footer */}
      {usage.contextualUsage && (
        <Card padding={4} tone="primary">
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <TbWorld size={16} />
              <Text weight="semibold">
                Site-wide Usage (
                {usage.contextualUsage.type === 'navigation' ? 'Navigation' : 'Footer'})
              </Text>
              <Badge tone="positive">
                {(usage.contextualUsage.allPages?.length || 0) +
                  (usage.contextualUsage.homePage ? 1 : 0)}{' '}
                pages
              </Badge>
            </Flex>

            <Text size={1} muted>
              This {usage.contextualUsage.type} appears on every page in{' '}
              {usage.contextualUsage.language.toUpperCase()}:
            </Text>

            {/* Homepage */}
            {usage.contextualUsage.homePage && (
              <Box paddingLeft={3}>
                <Flex align="center" justify="space-between">
                  <Text size={1}>🏠 {usage.contextualUsage.homePage.title}</Text>
                  <Badge tone="primary" fontSize={0}>
                    /{usage.contextualUsage.language}
                  </Badge>
                </Flex>
              </Box>
            )}

            {/* All Pages */}
            {usage.contextualUsage.allPages?.map((page) => (
              <Box key={page._id} paddingLeft={3}>
                <Flex align="center" justify="space-between">
                  <Text size={1}>📄 {page.title}</Text>
                  <Badge tone="primary" fontSize={0}>
                    /{page.language}/{page.slug?.current}
                  </Badge>
                </Flex>
              </Box>
            ))}

            {usage.contextualUsage.allPages?.length === 20 && (
              <Text size={0} muted style={{ fontStyle: 'italic' }}>
                ... and potentially more pages (showing first 20)
              </Text>
            )}
          </Stack>
        </Card>
      )}

      {/* Pages Usage */}
      {usage.referencingPages.length > 0 && (
        <Card padding={4}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <TbWorld size={16} />
              <Text weight="semibold">Used in Pages ({usage.referencingPages.length})</Text>
            </Flex>
            {usage.referencingPages.map((page) => (
              <Box key={page._id} paddingLeft={3}>
                <Flex align="center" justify="space-between">
                  <Text size={1}>{page.title}</Text>
                  <Flex align="center" gap={2}>
                    <Badge tone="primary" fontSize={0}>
                      {page.language?.toUpperCase()}
                    </Badge>
                    {page.market && (
                      <Badge tone="caution" fontSize={0}>
                        {page.market.toUpperCase()}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
                <Text size={0} muted>
                  /{page.language}/{page.slug?.current}
                </Text>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {/* Home Pages Usage */}
      {usage.referencingHomePages.length > 0 && (
        <Card padding={4}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <TbWorld size={16} />
              <Text weight="semibold">
                Used in Home Pages ({usage.referencingHomePages.length})
              </Text>
            </Flex>
            {usage.referencingHomePages.map((homepage) => (
              <Box key={homepage._id} paddingLeft={3}>
                <Flex align="center" justify="space-between">
                  <Text size={1}>{homepage.title}</Text>
                  <Flex align="center" gap={2}>
                    <Badge tone="primary" fontSize={0}>
                      {homepage.language?.toUpperCase()}
                    </Badge>
                    {homepage.market && (
                      <Badge tone="caution" fontSize={0}>
                        {homepage.market.toUpperCase()}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
                <Text size={0} muted>
                  /{homepage.language}
                </Text>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {/* Navigation Usage */}
      {usage.usedInNavigation.length > 0 && (
        <Card padding={4}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <TbMap2 size={16} />
              <Text weight="semibold">Used in Navigation ({usage.usedInNavigation.length})</Text>
            </Flex>
            {usage.usedInNavigation.map((nav) => (
              <Box key={nav._id} paddingLeft={3}>
                <Flex align="center" justify="space-between">
                  <Text size={1}>{nav.label}</Text>
                  <Flex align="center" gap={2}>
                    <Badge tone="primary" fontSize={0}>
                      {nav.language?.toUpperCase()}
                    </Badge>
                    {nav.market && (
                      <Badge tone="caution" fontSize={0}>
                        {nav.market.toUpperCase()}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {/* Footer Usage */}
      {usage.usedInFooter.length > 0 && (
        <Card padding={4}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <TbMap2 size={16} />
              <Text weight="semibold">Used in Footer ({usage.usedInFooter.length})</Text>
            </Flex>
            {usage.usedInFooter.map((footer) => (
              <Box key={footer._id} paddingLeft={3}>
                <Flex align="center" justify="space-between">
                  <Text size={1}>{footer.label}</Text>
                  <Flex align="center" gap={2}>
                    <Badge tone="primary" fontSize={0}>
                      {footer.language?.toUpperCase()}
                    </Badge>
                    {footer.market && (
                      <Badge tone="caution" fontSize={0}>
                        {footer.market.toUpperCase()}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {/* Bookmarks */}
      {usage.bookmarkedBy.length > 0 && (
        <Card padding={4}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <TbUser size={16} />
              <Text weight="semibold">Bookmarked by ({usage.bookmarkedBy.length})</Text>
            </Flex>
            {usage.bookmarkedBy.map((person) => (
              <Box key={person._id} paddingLeft={3}>
                <Text size={1}>{person.name}</Text>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {/* No usage */}
      {totalUsages === 0 && (
        <Card padding={4} tone="transparent">
          <Flex align="center" justify="center" direction="column" gap={3}>
            <Text align="center" muted>
              This document is not currently being used anywhere in your application.
            </Text>
            <Text size={1} align="center" muted>
              Once you reference this document in pages, navigation, or other content, its usage
              will appear here.
            </Text>
          </Flex>
        </Card>
      )}
    </Stack>
  )
}

export default DocumentUsageDisplay
