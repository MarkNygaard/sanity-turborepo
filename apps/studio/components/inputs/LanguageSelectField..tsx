import { Card, Flex, Stack, Text } from '@sanity/ui'
import { ComponentType, useEffect, useState } from 'react'
import { StringInputProps, useClient, PatchEvent, set } from 'sanity'
import groq from 'groq'

interface LanguageOption {
  _id: string
  title: string
  code: string
  isDefault?: boolean
}

const LanguageSelectField: ComponentType<StringInputProps> = (props) => {
  const client = useClient({ apiVersion: '2025-03-01' })
  const [languages, setLanguages] = useState<LanguageOption[]>([])
  const [loading, setLoading] = useState(true)

  const currentLanguage = props.value

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true)
        const query = groq`*[_type == "language"]|order(title asc) {
          _id,
          title,
          code,
          isDefault
        }`

        const result = await client.fetch<LanguageOption[]>(query)
        setLanguages(result)
      } catch (error) {
        console.error('Error fetching languages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLanguages()
  }, [client])

  if (loading) {
    return (
      <Stack space={2}>
        <Text size={1} weight="medium">
          Language
        </Text>
        <Card padding={3} tone="transparent" border>
          <Text size={1} muted>
            Loading languages...
          </Text>
        </Card>
      </Stack>
    )
  }

  return (
    <Stack space={2}>
      <Text size={1} weight="medium">
        Language
      </Text>
      <Card padding={2} border>
        <Stack space={1}>
          {languages.map((language) => (
            <Card
              key={language._id}
              padding={3}
              tone={currentLanguage === language.code ? 'primary' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => props.onChange(PatchEvent.from(set(language.code)))}
            >
              <Flex align="center" justify="space-between">
                <div>
                  <Text size={1} weight={currentLanguage === language.code ? 'medium' : 'regular'}>
                    {language.title}
                  </Text>
                  <Text size={0} muted>
                    {language.code} {language.isDefault ? '• Default' : ''}
                  </Text>
                </div>
                {currentLanguage === language.code && (
                  <Text size={0} weight="medium">
                    ✓ Selected
                  </Text>
                )}
              </Flex>
            </Card>
          ))}
        </Stack>
      </Card>
    </Stack>
  )
}

export default LanguageSelectField
