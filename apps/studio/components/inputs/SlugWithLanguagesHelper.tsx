import { Badge, Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType, useEffect, useState } from 'react'
import { SlugInputProps, useClient, useFormValue } from 'sanity'
import groq from 'groq'

interface ExistingSlug {
  language: string
  title: string
  _id: string
  market: string
}

const SlugWithLanguageHelper: ComponentType<SlugInputProps> = (props) => {
  const client = useClient({ apiVersion: '2025-03-01' })
  const [existingSlugs, setExistingSlugs] = useState<ExistingSlug[]>([])
  const [loading, setLoading] = useState(false)

  // Get document data from form context
  const document = useFormValue([]) as any
  const currentLanguage = document?.language
  const currentDocId = document?._id

  const currentSlug = props.value?.current

  useEffect(() => {
    if (!currentSlug || currentSlug.length < 2) {
      setExistingSlugs([])
      return
    }

    const fetchExistingSlugs = async () => {
      setLoading(true)
      try {
        // Get both draft and published IDs for current document
        const cleanId = currentDocId?.replace('drafts.', '')
        const draftId = `drafts.${cleanId}`

        const query = groq`*[
          _type == "page" 
          && slug.current == $slug 
          && _id != $currentId
          && _id != $draftId
          && !(_id in path("drafts.**") && (_id match "*" + $currentId))
        ] {
          _id,
          title,
          language,
          market
        } | order(language asc)`

        const results = await client.fetch<ExistingSlug[]>(query, {
          slug: currentSlug,
          currentId: cleanId,
          draftId: draftId,
        })

        setExistingSlugs(results)
      } catch (error) {
        console.error('Error fetching existing slugs:', error)
        setExistingSlugs([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce the API call
    const timeoutId = setTimeout(fetchExistingSlugs, 300)
    return () => clearTimeout(timeoutId)
  }, [currentSlug, client, currentDocId])

  const conflictingSlugs = existingSlugs.filter((page) => page.language === currentLanguage)
  const crossLanguageSlugs = existingSlugs.filter((page) => page.language !== currentLanguage)

  return (
    <Stack space={3}>
      {/* Render the default slug input */}
      {props.renderDefault(props)}

      {currentSlug && existingSlugs.length > 0 && (
        <Card padding={3} tone="transparent" border>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <Text size={1} weight="medium">
                Slug usage across languages
              </Text>
              <Badge tone="primary" fontSize={0}>
                {existingSlugs.length} page{existingSlugs.length !== 1 ? 's' : ''}
              </Badge>
            </Flex>

            {loading ? (
              <Text size={1} muted>
                Loading...
              </Text>
            ) : (
              <Stack space={3}>
                {/* Show conflicts first if any */}
                {conflictingSlugs.length > 0 && (
                  <Box>
                    <Text size={1} weight="medium" style={{ color: 'red' }}>
                      ⚠️ Conflicts in {currentLanguage?.toUpperCase()}:
                    </Text>
                    <Stack space={1} paddingTop={2}>
                      {conflictingSlugs.map((page) => (
                        <Flex key={page._id} align="center" justify="space-between">
                          <Text size={1}>{page.title}</Text>
                          <Badge tone="critical" fontSize={0}>
                            {page.market?.toUpperCase() || 'NO MARKET'}
                          </Badge>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Show cross-language usage */}
                {crossLanguageSlugs.length > 0 && (
                  <Box>
                    <Text size={1} weight="medium" style={{ color: 'green' }}>
                      ✅ Used in other languages:
                    </Text>
                    <Stack space={1} paddingTop={2}>
                      {crossLanguageSlugs.map((page) => (
                        <Flex key={page._id} align="center" justify="space-between">
                          <Text size={1}>{page.title}</Text>
                          <Flex align="center" gap={1}>
                            <Badge tone="primary" fontSize={0}>
                              {page.language?.toUpperCase() || 'NO LANG'}
                            </Badge>
                            <Badge tone="default" fontSize={0}>
                              {page.market?.toUpperCase() || 'NO MARKET'}
                            </Badge>
                          </Flex>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}

            <Box paddingTop={2}>
              <Text size={0} muted>
                Cross-language slug usage helps maintain consistent URL patterns across markets.
              </Text>
            </Box>
          </Stack>
        </Card>
      )}
    </Stack>
  )
}

export default SlugWithLanguageHelper
