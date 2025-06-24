// Re-export all types for easy importing
export type { Language, Market, MarketWithStats } from "./Market";
export type {
  DeploymentStatusType,
  DeploymentStatus,
  DeploymentResult,
  DeploymentHistory,
  StudioInfo,
} from "./Deployment";

// App-specific types
export interface AppConfig {
  baseHostname: string;
  projectId: string;
  dataset: string;
  organizationId: string;
}

export interface UIState {
  selectedMarket?: string;
  showDeploymentHistory: boolean;
  showAdvancedOptions: boolean;
}

export interface NotificationMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  autoClose?: boolean;
}
