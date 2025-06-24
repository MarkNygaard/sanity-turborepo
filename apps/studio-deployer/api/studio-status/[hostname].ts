export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { hostname } = req.query;

  if (!hostname || typeof hostname !== "string") {
    return res.status(400).json({ message: "Hostname is required" });
  }

  try {
    const studioUrl = `https://${hostname}.sanity.studio`;

    // Check if the studio is accessible
    const response = await fetch(studioUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      res.status(200).json({
        status: "active",
        url: studioUrl,
        lastChecked: new Date().toISOString(),
      });
    } else {
      res.status(200).json({
        status: "inactive",
        url: studioUrl,
        lastChecked: new Date().toISOString(),
        error: `HTTP ${response.status}`,
      });
    }
  } catch (error) {
    console.error(`Failed to check status for ${hostname}:`, error);
    res.status(200).json({
      status: "unknown",
      url: `https://${hostname}.sanity.studio`,
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
