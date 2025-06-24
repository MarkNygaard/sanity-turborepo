import type { DeploymentResult, Market } from "../types";

class DeploymentApi {
  private baseUrl = "/api";

  async deployMarket(market: Market): Promise<DeploymentResult> {
    const response = await fetch(`${this.baseUrl}/deploy-market`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ market }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        error.message || `Deployment failed with status ${response.status}`,
      );
    }

    return response.json();
  }

  async deployGlobalStudio(): Promise<DeploymentResult> {
    const response = await fetch(`${this.baseUrl}/deploy-global`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        error.message ||
          `Global studio deployment failed with status ${response.status}`,
      );
    }

    return response.json();
  }

  async deleteStudio(hostname: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete-studio`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostname }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        error.message ||
          `Studio deletion failed with status ${response.status}`,
      );
    }
  }

  async getStudioStatus(
    hostname: string,
  ): Promise<{ status: "active" | "inactive" | "unknown"; url?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/studio-status/${encodeURIComponent(hostname)}`,
      );

      if (!response.ok) {
        return { status: "unknown" };
      }

      return response.json();
    } catch (error) {
      console.warn(`Failed to check status for ${hostname}:`, error);
      return { status: "unknown" };
    }
  }

  async listDeployedStudios(): Promise<
    Array<{ hostname: string; url: string; market: string }>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/list-studios`);

      if (!response.ok) {
        throw new Error(`Failed to list studios: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Failed to list deployed studios:", error);
      return [];
    }
  }

  async generateMarketConfigs(): Promise<{
    success: boolean;
    configsGenerated: number;
  }> {
    const response = await fetch(`${this.baseUrl}/generate-configs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        error.message ||
          `Config generation failed with status ${response.status}`,
      );
    }

    return response.json();
  }
}

export const deploymentApi = new DeploymentApi();
