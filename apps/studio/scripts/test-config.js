// scripts/test-config.js
const path = require('path')

// We need to use a dynamic import for TypeScript files or compile them first
async function testConfiguration() {
  console.log('🧪 Testing market configuration...\n')

  try {
    // For now, we'll check if the TypeScript file exists and compile it
    const fs = require('fs')
    const tsFile = path.join(__dirname, '../lib/dynamicMarkets.ts')

    if (!fs.existsSync(tsFile)) {
      console.error('❌ dynamicMarkets.ts file not found')
      process.exit(1)
    }

    console.log('✅ dynamicMarkets.ts file exists')
    console.log('📝 Note: To fully test the configuration, you need to:')
    console.log('   1. Ensure TypeScript compilation works (run: npx tsc --noEmit)')
    console.log('   2. Start the studio (run: pnpm dev)')
    console.log('   3. Check the Markets Management tool in the studio')
    console.log('')

    // Basic file structure validation
    const content = fs.readFileSync(tsFile, 'utf8')

    const requiredExports = [
      'getDynamicMarketConfiguration',
      'validateMarketConfiguration',
      'invalidateMarketConfigCache',
    ]

    const missingExports = requiredExports.filter((exportName) => {
      // Check for various export patterns
      const patterns = [
        `export ${exportName}`,
        `export function ${exportName}`,
        `export async function ${exportName}`,
        `export const ${exportName}`,
        `${exportName}:`, // For object exports
      ]
      return !patterns.some((pattern) => content.includes(pattern))
    })

    if (missingExports.length > 0) {
      console.warn('⚠️  Missing expected exports:', missingExports.join(', '))
      console.warn('   Note: This might be due to different export syntax patterns')
    } else {
      console.log('✅ All required exports found in dynamicMarkets.ts')
    }

    // Check for required imports
    const requiredImports = ['createClient', 'groq']
    const missingImports = requiredImports.filter((importName) => !content.includes(importName))

    if (missingImports.length > 0) {
      console.warn('⚠️  Missing expected imports:', missingImports.join(', '))
    } else {
      console.log('✅ All required imports found in dynamicMarkets.ts')
    }

    // Check for key interfaces/types
    const requiredTypes = ['MarketConfiguration', 'DynamicMarket']
    const foundTypes = requiredTypes.filter(
      (typeName) =>
        content.includes(`interface ${typeName}`) || content.includes(`type ${typeName}`),
    )

    if (foundTypes.length > 0) {
      console.log(`✅ Found expected types: ${foundTypes.join(', ')}`)
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testConfiguration()
