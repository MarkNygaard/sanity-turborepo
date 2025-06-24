export type DeploymentStatusType = "idle" | "deploying" | "success" | "error";

export interface DeploymentStatus {
  market: string;
  status: DeploymentStatusType;
  url?: string;
  error?: string;
  deployedAt?: string;
  deploymentDuration?: number;
}

export interface DeploymentResult {
  success: boolean;
  url: string;
  hostname: string;
  market?: string;
  deploymentId?: string;
  timestamp: string;
}

export interface DeploymentHistory {
  id: string;
  market: string;
  status: DeploymentStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  error?: string;
  deployedBy?: string;
  version?: string;
}

export interface StudioInfo {
  hostname: string;
  url: string;
  market: string;
  status: "active" | "inactive" | "unknown";
  lastDeployed?: string;
  version?: string;
}
