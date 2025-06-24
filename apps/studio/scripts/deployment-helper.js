#!/usr/bin/env node

// scripts/deployment-helper.js
const fs = require('fs')
const path = require('path')

console.log('🚀 DILLING Studio Deployment Helper\n')

// Check if studio-deployer exists
const deployerPath = path.join(__dirname, '../../studio-deployer')
if (!fs.existsSync(deployerPath)) {
  console.log('❌ Studio deployer not found at:', deployerPath)
  console.log('\n📝 Setup Instructions:')
  console.log('1. Create the studio-deployer directory: mkdir -p ../studio-deployer/src')
  console.log('2. Copy the deployer files from the artifacts')
  console.log('3. Run: cd ../studio-deployer && pnpm install')
  console.log('4. Set up your .env file with Sanity credentials')
  process.exit(1)
}

// Check if configs directory exists
const configsDir = path.join(__dirname, '../configs')
if (!fs.existsSync(configsDir)) {
  console.log('⚠️  No generated configs found')
  console.log('\n🔧 Generate configs first:')
  console.log('   npm run generate:configs')
  console.log('\n📋 Available deployment commands:')
} else {
  const configFiles = fs
    .readdirSync(configsDir)
    .filter((f) => f.startsWith('sanity.config.') && f.endsWith('.ts'))
  console.log(`✅ Found ${configFiles.length} generated configs:`)
  configFiles.forEach((file) => {
    const market = file.replace('sanity.config.', '').replace('.ts', '')
    console.log(`   - ${market}`)
  })
  console.log('\n📋 Deployment commands:')
}

console.log('   npm run deploy:all-markets     # Deploy all markets')
console.log('   npm run deploy:market US       # Deploy specific market')
console.log('   npm run deploy:global          # Deploy global management')
console.log('   npm run list:studios           # List deployed studios')

console.log('\n🔧 Development commands:')
console.log('   npm run dev:global             # Test global config locally')
console.log('   npm run dev:us                 # Test US config locally')
console.log('   npm run dev:eu                 # Test EU config locally')

console.log('\n💡 Need help?')
console.log('   - Check the studio-deployer README')
console.log('   - Ensure your .env file is configured')
console.log('   - Verify your Sanity admin token has deployment permissions')

console.log('\n🎉 Happy deploying!')
