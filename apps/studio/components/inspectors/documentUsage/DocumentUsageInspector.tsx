import { CloseIcon } from '@sanity/icons'
import { Box, Button, Card, Flex, Text } from '@sanity/ui'
import { ComponentType } from 'react'
import { DocumentInspectorProps } from 'sanity'
import { styled } from 'styled-components'
import DocumentUsageDisplay from '../../tools/documentUsage/DocumentUsageDisplay'

const Root = styled(Card)({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  lineHeight: 0,
  background: 'var(--card-bg-color)',
  width: '100%',
})

const DocumentUsageInspector: ComponentType<DocumentInspectorProps> = (props) => {
  return (
    <Flex
      height={'fill'}
      width={'fill'}
      direction={'column'}
      align={'flex-start'}
      justify={'flex-start'}
    >
      {/* Header */}
      <Root>
        <Flex padding={3} gap={2} justify="space-between" align={'center'} width={'fill'}>
          <Box paddingLeft={3}>
            <Text as="h1" size={1} weight="medium">
              Document Usage Analytics
            </Text>
          </Box>

          <Button
            aria-label="Close usage analytics"
            icon={CloseIcon}
            mode="bleed"
            onClick={props.onClose}
          />
        </Flex>
      </Root>

      {/* Content */}
      <Box padding={4} width={'fill'}>
        <DocumentUsageDisplay documentId={props.documentId} documentType={props.documentType} />
      </Box>
    </Flex>
  )
}

export default DocumentUsageInspector
