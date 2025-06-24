import { execSync } from "child_process";
import { join } from "path";

import type { DeploymentResult, Market } from "../src/types";

const STUDIO_CONFIG = {
  baseHostname: "dilling",
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  basePath: "../studio", // Path to your studio code
};

function deployStudio(configName: string, hostname: string): DeploymentResult {
  const studioPath = join(process.cwd(), "..", "studio");
  const configPath = `configs/sanity.config.${configName}.ts`;

  console.log(`🚀 Deploying ${configName} to ${hostname}...`);

  try {
    const command = `cd ${studioPath} && npx sanity deploy --config ${configPath} --hostname ${hostname}`;
    execSync(command, { stdio: "inherit" });

    const result: DeploymentResult = {
      success: true,
      url: `https://${hostname}.sanity.studio`,
      hostname,
      market: configName,
      deploymentId: `${configName}-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `✅ Successfully deployed ${configName} to ${hostname}.sanity.studio`,
    );
    return result;
  } catch (error) {
    console.error(`❌ Failed to deploy ${configName}:`, error);
    throw new Error(
      `Deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { market }: { market: Market } = req.body;

    if (!market || !market.code || !market.title) {
      return res.status(400).json({
        message: "Invalid market data. Market code and title are required.",
      });
    }

    // Generate config first (this should ideally be done beforehand)
    const generateConfigPath = join(
      process.cwd(),
      "scripts",
      "generate-market-configs.ts",
    );
    try {
      execSync(`tsx ${generateConfigPath}`, { stdio: "pipe" });
    } catch (configError) {
      console.warn(
        "Failed to generate configs, proceeding with existing configs",
      );
    }

    const hostname = `${STUDIO_CONFIG.baseHostname}-${market.code.toLowerCase()}`;
    const result = deployStudio(market.code.toLowerCase(), hostname);

    res.status(200).json(result);
  } catch (error) {
    console.error("Deployment API error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Deployment failed",
      success: false,
    });
  }
}
