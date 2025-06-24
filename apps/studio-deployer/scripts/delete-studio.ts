import { execSync } from "child_process";

function deleteStudio(hostname: string) {
  if (!hostname) {
    console.error("❌ Please provide a hostname");
    console.log("Usage: npm run delete:studio -- dilling-us");
    process.exit(1);
  }

  console.log(`🗑️  Deleting studio: ${hostname}`);

  try {
    const command = `npx sanity undeploy --hostname ${hostname}`;
    execSync(command, { stdio: "inherit" });
    console.log(`✅ Successfully deleted ${hostname}.sanity.studio`);
  } catch (error) {
    console.error(`❌ Failed to delete ${hostname}:`, error);
    throw error;
  }
}

const hostname = process.argv[2];
deleteStudio(hostname);
