import { execSync } from "child_process";

export default async function handler(req: any, res: any) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { hostname } = req.body;

    if (!hostname || typeof hostname !== "string") {
      return res.status(400).json({ message: "Hostname is required" });
    }

    console.log(`🗑️  Deleting studio: ${hostname}`);

    const command = `npx sanity undeploy --hostname ${hostname}`;
    execSync(command, { stdio: "inherit" });

    console.log(`✅ Successfully deleted ${hostname}.sanity.studio`);

    res.status(200).json({
      success: true,
      message: `Studio ${hostname} has been successfully deleted`,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ Failed to delete studio:`, error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Studio deletion failed",
    });
  }
}
