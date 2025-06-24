import { defineCliConfig } from 'sanity/cli'
import type { UserConfig } from 'vite'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,

  /**
   * This is needed for the top level await to work during build time.
   */
  vite: (config: UserConfig): UserConfig => {
    return {
      ...config,
      build: {
        ...config.build,
        target: 'esnext',
      },
    }
  },
})
