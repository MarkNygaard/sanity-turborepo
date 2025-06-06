import { TbChartBar } from 'react-icons/tb'
import { defineDocumentInspector } from 'sanity'
import DocumentUsageInspector from './DocumentUsageInspector'

export const documentUsageInspector = defineDocumentInspector({
  name: 'documentUsage',
  component: DocumentUsageInspector,
  useMenuItem: () => ({
    icon: TbChartBar,
    showAsAction: true,
    title: 'Usage Analytics',
  }),
})
