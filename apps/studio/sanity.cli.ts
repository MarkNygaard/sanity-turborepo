import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './lib/api'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,

  /**
   * This is needed for the top level await to work during build time.
   */
  vite: (config) => {
    return {
      ...config,
      build: {
        ...config.build,
        target: 'esnext',
      },
    }
  },
})
