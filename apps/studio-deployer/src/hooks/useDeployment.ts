import { useCallback, useState } from "react";

import type { DeploymentStatus, Market } from "../types";
import { deploymentApi } from "../services/deploymentApi";

export function useDeployment() {
  const [deploymentStatuses, setDeploymentStatuses] = useState<
    DeploymentStatus[]
  >([]);
  const [isDeployingAll, setIsDeployingAll] = useState(false);

  const updateDeploymentStatus = useCallback(
    (market: string, status: Partial<DeploymentStatus>) => {
      setDeploymentStatuses((prev) => {
        const existing = prev.find((s) => s.market === market);
        if (existing) {
          return prev.map((s) =>
            s.market === market ? { ...s, ...status } : s,
          );
        }
        return [...prev, { market, status: "idle", ...status }];
      });
    },
    [],
  );

  const getDeploymentStatus = useCallback(
    (marketCode: string): DeploymentStatus => {
      return (
        deploymentStatuses.find((s) => s.market === marketCode) || {
          market: marketCode,
          status: "idle",
        }
      );
    },
    [deploymentStatuses],
  );

  const deployMarket = useCallback(
    async (market: Market) => {
      updateDeploymentStatus(market.code, { status: "deploying" });

      try {
        const result = await deploymentApi.deployMarket(market);
        updateDeploymentStatus(market.code, {
          status: "success",
          url: result.url,
          deployedAt: new Date().toISOString(),
        });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        updateDeploymentStatus(market.code, {
          status: "error",
          error: errorMessage,
        });
        throw error;
      }
    },
    [updateDeploymentStatus],
  );

  const deployGlobalStudio = useCallback(async () => {
    updateDeploymentStatus("global", { status: "deploying" });

    try {
      const result = await deploymentApi.deployGlobalStudio();
      updateDeploymentStatus("global", {
        status: "success",
        url: result.url,
        deployedAt: new Date().toISOString(),
      });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      updateDeploymentStatus("global", {
        status: "error",
        error: errorMessage,
      });
      throw error;
    }
  }, [updateDeploymentStatus]);

  const deployAllMarkets = useCallback(
    async (markets: Market[]) => {
      setIsDeployingAll(true);
      const results: Array<{
        market: string;
        success: boolean;
        error?: string;
      }> = [];

      try {
        // Deploy global studio first
        await deployGlobalStudio();
        results.push({ market: "global", success: true });

        // Deploy each market sequentially to avoid overwhelming the system
        for (const market of markets) {
          try {
            await deployMarket(market);
            results.push({ market: market.code, success: true });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            results.push({
              market: market.code,
              success: false,
              error: errorMessage,
            });
          }
        }

        return results;
      } finally {
        setIsDeployingAll(false);
      }
    },
    [deployMarket, deployGlobalStudio],
  );

  const deleteStudio = useCallback(
    async (hostname: string) => {
      updateDeploymentStatus(hostname, { status: "deploying" });

      try {
        await deploymentApi.deleteStudio(hostname);
        setDeploymentStatuses((prev) =>
          prev.filter((s) => s.market !== hostname),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        updateDeploymentStatus(hostname, {
          status: "error",
          error: errorMessage,
        });
        throw error;
      }
    },
    [updateDeploymentStatus],
  );

  const clearDeploymentHistory = useCallback(() => {
    setDeploymentStatuses([]);
  }, []);

  return {
    deploymentStatuses,
    isDeployingAll,
    deployMarket,
    deployGlobalStudio,
    deployAllMarkets,
    deleteStudio,
    getDeploymentStatus,
    clearDeploymentHistory,
    // Statistics
    totalDeployments: deploymentStatuses.length,
    successfulDeployments: deploymentStatuses.filter(
      (s) => s.status === "success",
    ).length,
    failedDeployments: deploymentStatuses.filter((s) => s.status === "error")
      .length,
    activeDeployments: deploymentStatuses.filter(
      (s) => s.status === "deploying",
    ).length,
  };
}
