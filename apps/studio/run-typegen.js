const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Backup original config
const originalConfig = path.join(__dirname, 'sanity.config.ts')
const backupConfig = path.join(__dirname, 'sanity.config.backup.ts')
const typegenConfig = path.join(__dirname, 'sanity.config.typegen.ts')

try {
  // Backup current config
  fs.copyFileSync(originalConfig, backupConfig)

  // Use typegen config
  fs.copyFileSync(typegenConfig, originalConfig)

  // Run typegen
  execSync('pnpm exec sanity schema extract --enforce-required-fields', { stdio: 'inherit' })

  console.log('Schema extracted successfully')
} catch (error) {
  console.error('Error during typegen:', error.message)
  process.exit(1)
} finally {
  // Restore original config
  if (fs.existsSync(backupConfig)) {
    fs.copyFileSync(backupConfig, originalConfig)
    fs.unlinkSync(backupConfig)
  }
}
