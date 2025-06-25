import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  console.error(
    "❌ SANITY_PROJECT_ID and SANITY_DATASET must be set in environment",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2023-01-01",
  useCdn: false,
});

async function main() {
  try {
    // Try to fetch a single document
    const docs = await client.fetch("*[0]", {});
    console.log("✅ Successfully connected to Sanity API");
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ Failed to connect to Sanity API:", msg);
    process.exit(1);
  }
}

main();
