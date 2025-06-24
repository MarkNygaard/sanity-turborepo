import { execSync } from "child_process";
import { join } from "path";

import type { DeploymentResult } from "../src/types";

const STUDIO_CONFIG = {
  baseHostname: "dilling",
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  basePath: "../studio",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const studioPath = join(process.cwd(), "..", "studio");
    const configPath = "configs/sanity.config.global.ts";
    const hostname = `${STUDIO_CONFIG.baseHostname}-global`;

    console.log(`🌍 Deploying global management studio to ${hostname}...`);

    // Generate configs first
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

    // Deploy global studio
    const command = `cd ${studioPath} && npx sanity deploy --config ${configPath} --hostname ${hostname}`;
    execSync(command, { stdio: "inherit" });

    const result: DeploymentResult = {
      success: true,
      url: `https://${hostname}.sanity.studio`,
      hostname,
      market: "global",
      deploymentId: `global-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `✅ Successfully deployed global studio to ${hostname}.sanity.studio`,
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Global deployment API error:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Global deployment failed",
      success: false,
    });
  }
}
