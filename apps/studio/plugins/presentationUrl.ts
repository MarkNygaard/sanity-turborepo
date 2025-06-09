import { EarthGlobeIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { useCallback } from 'react'
import { definePlugin, useGetFormValue } from 'sanity'
import { useRouter } from 'sanity/router'

export const presentationUrl = definePlugin(() => {
  return {
    name: 'presentationUrl',
    document: {
      unstable_fieldActions: (prev, context) => {
        // Only show the action for document types that make sense to preview
        const previewableTypes = ['page', 'homePage', 'settings', 'navigation', 'footer']

        if (!previewableTypes.includes(context.schemaType.name)) {
          return prev
        }

        return [
          ...prev,
          {
            name: 'open-in-presentation',
            useAction: ({ documentId }: { documentId: string }) => {
              const getFormValue = useGetFormValue()
              const router = useRouter()
              const toast = useToast()

              const handlePresentationOpen = useCallback(() => {
                // Get the current document values
                const slug = getFormValue(['slug', 'current'])
                const language = getFormValue(['language'])
                const market = getFormValue(['market'])
                const documentType = context.schemaType.name

                // Type guard for string values
                const isString = (value: unknown): value is string =>
                  typeof value === 'string' && value.trim() !== ''

                // Determine the preview path based on document type and available fields
                let previewPath = ''

                if (documentType === 'homePage') {
                  // For home pages, use just the language as the path
                  previewPath = isString(language) ? `/${language}` : '/'
                } else if (documentType === 'page' && isString(slug)) {
                  // For regular pages, include both slug and language
                  const langPath = isString(language) ? `/${language}` : ''
                  previewPath = `${langPath}/${slug}`
                } else if (isString(slug)) {
                  // Fallback for other document types with slugs
                  const langPath = isString(language) ? `/${language}` : ''
                  previewPath = `${langPath}/${slug}`
                } else {
                  // Fallback to language path or root
                  previewPath = isString(language) ? `/${language}` : '/'
                }

                try {
                  // Get the current workspace base path to maintain context
                  const currentPath = router.state.space || ''

                  // Construct the full preview URL
                  const baseUrl =
                    process.env.SANITY_STUDIO_PRESENTATION_URL ?? 'http://localhost:3000'
                  const previewUrl = `${baseUrl}${previewPath}?preview=true`

                  // Navigate to presentation mode within the current workspace
                  const presentationPath = currentPath
                    ? `/${currentPath}/market-${market}/presentation?preview=${encodeURIComponent(previewUrl)}`
                    : `/market-${market}/presentation?preview=${encodeURIComponent(previewUrl)}`

                  router.navigateUrl({
                    path: presentationPath,
                  })
                } catch (error) {
                  console.error('Error opening presentation:', error)
                  toast.push({
                    title: 'Error opening presentation',
                    status: 'error',
                    description: 'Unable to open the document in presentation mode',
                  })
                }
              }, [getFormValue, toast, router])

              return {
                type: 'action' as const,
                icon: EarthGlobeIcon,
                hidden: documentId === 'root',
                renderAsButton: true,
                onAction: handlePresentationOpen,
                title: 'Open in Presentation',
              }
            },
          },
        ]
      },
    },
  }
})
