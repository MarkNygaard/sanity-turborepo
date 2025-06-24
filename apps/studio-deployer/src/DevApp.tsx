import React, { useState } from "react";

import "./App.css";

import { useDocuments } from "@sanity/sdk-react"; // Add this line

// Mock data for development
const mockMarkets = [
  {
    _id: "1",
    code: "US",
    title: "United States",
    flag: "🇺🇸",
    languages: [
      { code: "en", title: "English", _id: "1", isDefault: true },
      { code: "es", title: "Spanish", _id: "2" },
    ],
  },
  {
    _id: "2",
    code: "EU",
    title: "European Union",
    flag: "🇪🇺",
    languages: [
      { code: "en", title: "English", _id: "1" },
      { code: "de", title: "German", _id: "3", isDefault: true },
      { code: "fr", title: "French", _id: "4" },
    ],
  },
  {
    _id: "3",
    code: "NORDIC",
    title: "Nordic Countries",
    flag: "🇩🇰",
    languages: [
      { code: "da", title: "Danish", _id: "5", isDefault: true },
      { code: "sv", title: "Swedish", _id: "6" },
      { code: "no", title: "Norwegian", _id: "7" },
    ],
  },
];

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  devNotice: {
    padding: "1rem",
    background: "#fff3cd",
    border: "1px solid #ffeaa7",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: 0,
    color: "#333",
  },
  button: {
    padding: "0.75rem 1.5rem",
    background: "#007acc",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
  },
  buttonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
  },
  buttonSuccess: {
    background: "#28a745",
  },
  buttonSecondary: {
    background: "#6c757d",
  },
  card: {
    background: "white",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "500",
    textTransform: "uppercase" as const,
  },
  badgeDefault: { background: "#f8f9fa", color: "#6c757d" },
  badgeSuccess: { background: "#d4edda", color: "#155724" },
  badgeWarning: { background: "#fff3cd", color: "#856404" },
  badgeError: { background: "#f8d7da", color: "#721c24" },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  flexGap: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },
  codeBlock: {
    fontFamily: "monospace",
    background: "#f5f5f5",
    padding: "0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    margin: "0.25rem 0",
  },
};

// Simple development version without Sanity UI components
export function DevApp() {
  const [deploymentStatuses, setDeploymentStatuses] = useState<
    Record<string, string>
  >({});

  const {
    data: sanityMarkets,
    isPending,
    error,
  } = useDocuments({
    filter: `_type == "market"`,
    orderBy: "title asc",
  });

  const markets =
    sanityMarkets && sanityMarkets.length > 0 ? sanityMarkets : mockMarkets;

  const deployMarket = async (marketCode: string) => {
    setDeploymentStatuses((prev) => ({ ...prev, [marketCode]: "deploying" }));

    // Simulate deployment
    setTimeout(() => {
      setDeploymentStatuses((prev) => ({ ...prev, [marketCode]: "success" }));
    }, 2000);
  };

  const deployAllMarkets = async () => {
    for (const market of markets) {
      await deployMarket(market.code);
    }
  };

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "success":
        return { ...styles.badge, ...styles.badgeSuccess };
      case "error":
        return { ...styles.badge, ...styles.badgeError };
      case "deploying":
        return { ...styles.badge, ...styles.badgeWarning };
      default:
        return { ...styles.badge, ...styles.badgeDefault };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "deploying":
        return "⏳";
      default:
        return "🚀";
    }
  };

  return (
    <div style={styles.container}>
      {/* Development Notice */}
      <div style={styles.devNotice}>
        <div style={styles.flexGap}>
          <span style={{ fontSize: "1.5rem" }}>🚧</span>
          <div>
            <strong>Development Mode</strong>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#856404",
                marginTop: "0.25rem",
              }}
            >
              {isPending
                ? "⏳ Loading markets from Sanity..."
                : error
                  ? "❌ Error loading from Sanity, using mock data"
                  : sanityMarkets && sanityMarkets.length > 0
                    ? `✅ Using ${sanityMarkets.length} markets from Sanity CMS`
                    : "🔧 Using mock data (no markets found in Sanity)"}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🌍 DILLING Studio Deployment Manager</h1>
        <button style={styles.button} onClick={deployAllMarkets}>
          🚀 Deploy All Markets
        </button>
      </div>

      {/* Global Studio Card */}
      <div style={styles.card}>
        <div style={styles.flexBetween}>
          <div>
            <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem" }}>
              Global Management Studio
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              Central administration and market management
            </p>
          </div>
          <div style={styles.flexGap}>
            <span style={getBadgeStyle(deploymentStatuses["global"] || "idle")}>
              {deploymentStatuses["global"] || "idle"}
            </span>
            <span style={{ fontSize: "1.5rem" }}>
              {getStatusIcon(deploymentStatuses["global"] || "idle")}
            </span>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Market-Specific Studios
      </h2>
      <div style={styles.grid}>
        {markets.map((market) => {
          const status = deploymentStatuses[market.code] || "idle";
          return (
            <div key={market._id} style={styles.card}>
              <div style={styles.flexBetween}>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                    {market.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 1rem 0",
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                    {market.languages.length} language
                    {market.languages.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span style={{ fontSize: "2rem" }}>{market.flag}</span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <strong style={{ fontSize: "0.9rem" }}>Languages:</strong>
                <div
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {market.languages.map((lang) => lang.title).join(", ")}
                </div>
              </div>

              <div style={styles.flexBetween}>
                <span style={getBadgeStyle(status)}>{status}</span>
                <div style={styles.flexGap}>
                  {status === "success" && (
                    <a
                      href={`https://dilling-${market.code.toLowerCase()}.sanity.studio`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...styles.button,
                        ...styles.buttonSecondary,
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        padding: "0.5rem 1rem",
                      }}
                    >
                      Open Studio
                    </a>
                  )}
                  <button
                    style={{
                      ...styles.button,
                      ...(status === "deploying" ? styles.buttonDisabled : {}),
                      ...(status === "success" ? styles.buttonSuccess : {}),
                      fontSize: "0.875rem",
                      padding: "0.5rem 1rem",
                    }}
                    onClick={() => deployMarket(market.code)}
                    disabled={status === "deploying"}
                  >
                    {getStatusIcon(status)} Deploy
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLI Commands */}
      <div style={styles.card}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem" }}>
          📝 CLI Commands
        </h3>
        <p style={{ margin: "0 0 1rem 0", fontSize: "0.9rem", color: "#666" }}>
          Available deployment commands:
        </p>
        <div style={styles.codeBlock}>pnpm run deploy:all</div>
        <div style={styles.codeBlock}>pnpm run deploy:market US</div>
        <div style={styles.codeBlock}>pnpm run list:studios</div>
        <div style={styles.codeBlock}>pnpm run test-connection</div>
      </div>

      {/* Info */}
      <div
        style={{
          ...styles.card,
          background: "#f8f9fa",
          borderColor: "#dee2e6",
        }}
      >
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
          💡 This development interface shows how the deployment manager will
          work. For actual deployments, use the CLI commands or deploy to Sanity
          Dashboard.
        </p>
      </div>
    </div>
  );
}

export default DevApp;
