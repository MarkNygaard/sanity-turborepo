#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Setting up DILLING Studio Deployment Manager...\n");

// Check if we're in the right directory
if (!fs.existsSync("package.json")) {
  console.log("❌ Please run this script from the studio-deployer directory");
  process.exit(1);
}

// Check Node.js version
const nodeVersion = process.version.slice(1).split(".")[0];
if (parseInt(nodeVersion) < 18) {
  console.log(`❌ Node.js 18+ required. Current version: ${process.version}`);
  process.exit(1);
}

console.log("✅ Node.js version check passed");

// Install dependencies
console.log("📦 Installing dependencies...");
try {
  execSync("pnpm install", { stdio: "inherit" });
  console.log("✅ Dependencies installed successfully");
} catch (error) {
  console.log("❌ Failed to install dependencies");
  process.exit(1);
}

// Check for environment file
if (!fs.existsSync(".env")) {
  console.log("⚠️  No .env file found. Creating from example...");
  fs.copyFileSync(".env.example", ".env");
  console.log("");
  console.log(
    "🔧 Please edit .env file with your actual Sanity configuration:",
  );
  console.log("   - SANITY_PROJECT_ID");
  console.log("   - SANITY_DATASET");
  console.log("   - SANITY_ORGANIZATION_ID");
  console.log("");
  console.log("💡 You can find these values in your Sanity dashboard");
  console.log("");
}

// Check if Sanity CLI is available
try {
  execSync("sanity --version", { stdio: "pipe" });
  console.log("✅ Sanity CLI available");
} catch (error) {
  console.log("⚠️  Sanity CLI not found globally. Installing locally...");
  try {
    execSync("pnpm add sanity", { stdio: "inherit" });
    console.log("✅ Sanity CLI installed locally");
  } catch (installError) {
    console.log("❌ Failed to install Sanity CLI");
    process.exit(1);
  }
}

// Validate environment variables
console.log("🔍 Validating environment configuration...");

let setupIncomplete = false;

try {
  const envContent = fs.readFileSync(".env", "utf8");

  if (envContent.includes("your_project_id_here")) {
    console.log("❌ Please set SANITY_PROJECT_ID in .env file");
    setupIncomplete = true;
  }

  if (envContent.includes("your_organization_id_here")) {
    console.log("❌ Please set SANITY_ORGANIZATION_ID in .env file");
    setupIncomplete = true;
  }

  if (setupIncomplete) {
    console.log("");
    console.log(
      "🔧 Please complete your .env configuration and run setup again",
    );
    console.log("");
    console.log("Find your values at:");
    console.log("   Project ID & Dataset: https://sanity.io/manage");
    console.log("   Organization ID: https://sanity.io/organizations");
    process.exit(1);
  }

  console.log("✅ Environment configuration validated");
} catch (error) {
  console.log("❌ Could not read .env file");
  process.exit(1);
}

// Test connection to Sanity
console.log("🔌 Testing Sanity connection...");
try {
  execSync("pnpm run test-connection", { stdio: "pipe" });
  console.log("✅ Sanity connection test passed");
} catch (error) {
  console.log(
    "⚠️  Could not test Sanity connection. This is normal if markets aren't set up yet.",
  );
}

console.log("");
console.log("🎉 Setup completed successfully!");
console.log("");
console.log("📋 Next steps:");
console.log("");
console.log("1. Start development server:");
console.log("   pnpm run dev");
console.log("");
console.log("2. Open http://localhost:3333 in your browser");
console.log("");
console.log("3. Deploy to Sanity Dashboard:");
console.log("   pnpm run deploy");
console.log("");
console.log("🔧 Available commands:");
console.log("   pnpm run dev              # Development server");
console.log("   pnpm run deploy           # Deploy to Sanity Dashboard");
console.log("   pnpm run deploy:all       # Deploy all market studios");
console.log("   pnpm run deploy:market US # Deploy specific market");
console.log("   pnpm run list:studios     # List deployed studios");
console.log("");
console.log("📚 Read README.md for detailed usage instructions");
console.log("");
console.log("🎯 Happy deploying!");
