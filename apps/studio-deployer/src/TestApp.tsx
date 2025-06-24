import React from "react";

// Test Sanity UI import with proper ES modules
let SanityUITest = null;
try {
  // Try to import Sanity UI components
  const { Card, Text, Box } = await import("@sanity/ui");
  SanityUITest = () => (
    <Card padding={4} style={{ margin: "1rem 0" }}>
      <Text>✅ Sanity UI is working!</Text>
    </Card>
  );
} catch (error) {
  console.error("Sanity UI import error:", error);
}

export function TestApp() {
  const [sanityUIWorking, setSanityUIWorking] = React.useState(false);

  React.useEffect(() => {
    // Test dynamic import
    import("@sanity/ui")
      .then(() => {
        setSanityUIWorking(true);
        console.log("✅ Sanity UI imported successfully");
      })
      .catch((error) => {
        console.error("❌ Sanity UI import failed:", error);
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 DILLING Studio Deployment Manager</h1>
      <p>✅ React is working!</p>
      <p>✅ TypeScript is working!</p>
      <p>✅ Vite is serving the app!</p>
      <p>
        {sanityUIWorking
          ? "✅ Sanity UI is available!"
          : "⏳ Testing Sanity UI..."}
      </p>

      <div
        style={{
          padding: "1rem",
          background: "#e8f5e8",
          border: "1px solid #4caf50",
          borderRadius: "4px",
          marginTop: "1rem",
        }}
      >
        <strong>Environment Check:</strong>
        <ul>
          <li>
            Project ID: {import.meta.env.VITE_SANITY_PROJECT_ID || "Not set"}
          </li>
          <li>Dataset: {import.meta.env.VITE_SANITY_DATASET || "Not set"}</li>
          <li>
            Organization ID:{" "}
            {import.meta.env.VITE_SANITY_ORGANIZATION_ID || "Not set"}
          </li>
        </ul>
      </div>

      <div
        style={{
          padding: "1rem",
          background: sanityUIWorking ? "#e8f5e8" : "#fff3cd",
          border: `1px solid ${sanityUIWorking ? "#4caf50" : "#ffc107"}`,
          borderRadius: "4px",
          marginTop: "1rem",
        }}
      >
        <strong>Dependencies Status:</strong>
        <ul>
          <li>
            @sanity/ui:{" "}
            {sanityUIWorking ? "✅ Available" : "❌ Missing or failed to load"}
          </li>
        </ul>

        {!sanityUIWorking && (
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Install command:</strong>
            <code
              style={{
                display: "block",
                background: "#f5f5f5",
                padding: "0.5rem",
                marginTop: "0.25rem",
                borderRadius: "3px",
              }}
            >
              pnpm add @sanity/ui @sanity/icons
            </code>
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          style={{
            padding: "0.5rem 1rem",
            background: "#007acc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "1rem",
          }}
          onClick={() => {
            console.log("Environment variables:", {
              projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
              dataset: import.meta.env.VITE_SANITY_DATASET,
              orgId: import.meta.env.VITE_SANITY_ORGANIZATION_ID,
            });
            alert("Check console for environment variables!");
          }}
        >
          Test Environment Variables
        </button>

        {sanityUIWorking && (
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              // Switch to the full DevApp
              window.location.reload();
            }}
          >
            Load Full Interface
          </button>
        )}
      </div>
    </div>
  );
}

export default TestApp;
