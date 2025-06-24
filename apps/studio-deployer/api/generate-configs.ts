import { execSync } from "child_process";
import { join } from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("📝 Generating market-specific configurations...");

    const generateConfigPath = join(
      process.cwd(),
      "scripts",
      "generate-market-configs.ts",
    );

    // Run the config generation script
    const output = execSync(`tsx ${generateConfigPath}`, {
      encoding: "utf8",
      stdio: "pipe",
    });

    // Parse output to count generated configs
    const lines = output.split("\n");
    const generatedConfigs = lines.filter(
      (line) =>
        line.includes("Generated config for") ||
        line.includes("Generated global config"),
    ).length;

    console.log(`✅ Generated ${generatedConfigs} configuration files`);

    res.status(200).json({
      success: true,
      configsGenerated: generatedConfigs,
      message: `Successfully generated ${generatedConfigs} studio configurations`,
      timestamp: new Date().toISOString(),
      output: output.trim(),
    });
  } catch (error) {
    console.error("Config generation failed:", error);

    const errorOutput =
      error instanceof Error && "stdout" in error
        ? (error as any).stdout?.toString() || error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";

    res.status(500).json({
      success: false,
      message: "Failed to generate configurations",
      error: errorOutput,
      timestamp: new Date().toISOString(),
    });
  }
}
