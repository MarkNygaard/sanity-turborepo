import { STUDIO_CONFIG } from "./config.js";
import { deployStudio } from "./deploy-market.js";
import { generateAllMarketConfigs } from "./generate-market-configs.js";

async function deployAllMarkets() {
  console.log("🔄 Starting multi-market studio deployment...\n");

  // Step 1: Generate configs
  console.log("📝 Generating market-specific configurations...");
  const markets = await generateAllMarketConfigs();

  // Step 2: Deploy global studio
  console.log("\n🌍 Deploying global management studio...");
  deployStudio("global", `${STUDIO_CONFIG.baseHostname}-global`);

  // Step 3: Deploy market studios
  console.log("\n🏢 Deploying market-specific studios...");
  for (const market of markets) {
    const hostname = `${STUDIO_CONFIG.baseHostname}-${market.code.toLowerCase()}`;
    deployStudio(market.code.toLowerCase(), hostname);
  }

  console.log("\n🎉 All studios deployed successfully!");
  console.log("\n📋 Access your studios at:");
  console.log(
    `   Global Management: ${STUDIO_CONFIG.baseHostname}-global.sanity.studio`,
  );

  for (const market of markets) {
    const hostname = `${STUDIO_CONFIG.baseHostname}-${market.code.toLowerCase()}`;
    console.log(`   ${market.title}: ${hostname}.sanity.studio`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployAllMarkets().catch((error) => {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  });
}

export { deployAllMarkets };
