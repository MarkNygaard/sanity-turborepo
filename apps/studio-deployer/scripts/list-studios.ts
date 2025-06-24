import { client } from "./config.js";

async function listDeployedStudios() {
  console.log("📋 Listing all deployed studios...\n");

  try {
    // This would use the Sanity App SDK to list studios
    // For now, we'll list based on our market data

    const markets = await client.fetch(`*[_type == "market"]{ code, title }`);

    console.log("🌍 Expected studio URLs based on your markets:");
    console.log("   Global Management: dilling-global.sanity.studio");

    for (const market of markets) {
      const hostname = `dilling-${market.code.toLowerCase()}`;
      console.log(`   ${market.title}: ${hostname}.sanity.studio`);
    }

    console.log("\n💡 Use the Sanity dashboard to verify actual deployments");
  } catch (error) {
    console.error("❌ Failed to list studios:", error);
  }
}

listDeployedStudios();
