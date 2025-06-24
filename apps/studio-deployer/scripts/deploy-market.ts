import { execSync } from "child_process";
import { join } from "path";

import { STUDIO_CONFIG } from "./config.js";
import { generateAllMarketConfigs } from "./generate-market-configs.js";

// Extract the deployStudio function so it can be reused
export function deployStudio(configName: string, hostname: string) {
  const studioPath = join(process.cwd(), "..", "studio");
  const configPath = `configs/sanity.config.${configName}.ts`;

  console.log(`🚀 Deploying ${configName} to ${hostname}...`);

  try {
    const command = `cd ${studioPath} && npx sanity deploy --config ${configPath} --hostname ${hostname}`;
    execSync(command, { stdio: "inherit" });
    console.log(
      `✅ Successfully deployed ${configName} to ${hostname}.sanity.studio`,
    );
  } catch (error) {
    console.error(`❌ Failed to deploy ${configName}:`, error);
    throw error;
  }
}

async function deploySpecificMarket(marketCode: string) {
  if (!marketCode) {
    console.error("❌ Please provide a market code");
    console.log("Usage: npm run deploy:market -- US");
    process.exit(1);
  }

  console.log(`🔄 Deploying studio for market: ${marketCode}`);

  // Generate configs first
  const markets = await generateAllMarketConfigs();
  const market = markets.find(
    (m) => m.code.toUpperCase() === marketCode.toUpperCase(),
  );

  if (!market) {
    console.error(`❌ Market '${marketCode}' not found`);
    console.log("Available markets:", markets.map((m) => m.code).join(", "));
    process.exit(1);
  }

  // Use the shared deployStudio function
  const hostname = `${STUDIO_CONFIG.baseHostname}-${market.code.toLowerCase()}`;
  deployStudio(market.code.toLowerCase(), hostname);
}

// Get market code from command line
const marketCode = process.argv[2];
deploySpecificMarket(marketCode).catch((error) => {
  console.error("💥 Deployment failed:", error);
  process.exit(1);
});
