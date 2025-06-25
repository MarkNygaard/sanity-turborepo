import React from "react";
import {
  CheckmarkIcon,
  EarthGlobeIcon,
  RefreshIcon,
  RocketIcon,
  WarningOutlineIcon,
} from "@sanity/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";

import type { DeploymentStatusType } from "../types";
import type { Market } from "../types/Market";
import { useDeployment } from "../hooks/useDeployment";
import { useMarkets } from "../hooks/useMarkets";

export function StudioDeploymentManager() {
  // Use custom hooks
  const { markets, isPending, hasMarkets, totalMarkets, totalLanguages } =
    useMarkets();
  const {
    deploymentStatuses,
    isDeployingAll,
    deployMarket,
    deployAllMarkets,
    getDeploymentStatus,
    successfulDeployments,
    failedDeployments,
    activeDeployments,
    clearDeploymentHistory,
  } = useDeployment();

  // Refresh handler (for now, just reloads the page to re-fetch everything)
  const handleRefresh = () => {
    // In a real app, you might want to re-fetch markets and/or deployment statuses via hooks
    window.location.reload();
  };

  const getStatusIcon = (status: DeploymentStatusType) => {
    switch (status) {
      case "deploying":
        return <Spinner />;
      case "success":
        return <CheckmarkIcon style={{ color: "green" }} />;
      case "error":
        return <WarningOutlineIcon style={{ color: "red" }} />;
      default:
        return <RocketIcon />;
    }
  };

  const getStatusColor = (status: DeploymentStatusType) => {
    switch (status) {
      case "success":
        return "positive";
      case "error":
        return "critical";
      case "deploying":
        return "caution";
      default:
        return "default";
    }
  };

  if (isPending) {
    return (
      <Container width={4}>
        <Flex align="center" justify="center" padding={4}>
          <Spinner /> <Text style={{ marginLeft: 12 }}>Loading markets...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container width={5}>
      <Box padding={4}>
        <Stack space={4}>
          {/* Deployment Stats Summary */}
          <Flex
            align="center"
            justify="space-between"
            style={{ marginBottom: 16 }}
          >
            <Stack space={2}>
              <Text size={1} weight="medium">
                Deployment Summary
              </Text>
              <Flex gap={3}>
                <Badge tone="positive">
                  Successful: {successfulDeployments}
                </Badge>
                <Badge tone="critical">Failed: {failedDeployments}</Badge>
                <Badge tone="caution">Active: {activeDeployments}</Badge>
                <Badge tone="primary">Markets: {totalMarkets}</Badge>
                <Badge tone="primary">Languages: {totalLanguages}</Badge>
              </Flex>
            </Stack>
            <Button
              icon={RefreshIcon}
              text="Refresh"
              mode="ghost"
              onClick={handleRefresh}
              tone="default"
              style={{ marginLeft: 16 }}
            />
          </Flex>

          {/* Header */}
          <Flex align="center" justify="space-between">
            <Heading size={2}>
              <EarthGlobeIcon style={{ marginRight: "8px" }} />
              DILLING Studio Deployment Manager
            </Heading>
            <Button
              icon={RocketIcon}
              text="Deploy All Markets"
              tone="primary"
              onClick={() => {
                deployAllMarkets(markets);
              }}
              disabled={isDeployingAll || !hasMarkets}
            />
          </Flex>

          {/* Global Studio Card */}
          <Card padding={4} border radius={2}>
            <Flex align="center" justify="space-between">
              <Box>
                <Stack space={2}>
                  <Heading size={1}>Global Management Studio</Heading>
                  <Text size={1} muted>
                    Central administration and market management
                  </Text>
                </Stack>
              </Box>
              <Flex align="center" gap={3}>
                <Badge
                  tone={getStatusColor(getDeploymentStatus("global").status)}
                >
                  {getDeploymentStatus("global").status}
                </Badge>
                {getStatusIcon(getDeploymentStatus("global").status)}
              </Flex>
            </Flex>
          </Card>

          {/* Markets Grid */}
          <Stack space={3}>
            <Heading size={1}>Market-Specific Studios</Heading>
            <Grid columns={2} gap={3}>
              {markets.map((market) => {
                if (!market) return null;
                const status = getDeploymentStatus(market.code);
                return (
                  <Card key={market._id} padding={4} border radius={2}>
                    <Stack space={2}>
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={2}>
                          <Heading size={1}>{market.title}</Heading>
                          <Text size={1} muted>
                            {market.languages.length} language
                            {market.languages.length !== 1 ? "s" : ""}
                          </Text>
                        </Flex>

                        <Text size={4}>
                          {market.flag || market.flagCode || "🌍"}
                        </Text>
                      </Flex>

                      <Flex align="center" gap={2}>
                        <Text size={1} weight="medium">
                          Languages:
                        </Text>
                        <Text size={1} muted>
                          {market.languages
                            .map((lang) => lang.title)
                            .join(", ")}
                        </Text>
                      </Flex>

                      <Flex align="center" justify="space-between">
                        <Badge tone={getStatusColor(status.status)}>
                          {status.status}
                        </Badge>
                        <Flex align="center" gap={2}>
                          {status.url && (
                            <Button
                              as="a"
                              href={status.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              text="Open Studio"
                              mode="ghost"
                              size={1}
                            />
                          )}
                          <Button
                            icon={getStatusIcon(status.status)}
                            text="Deploy"
                            tone="primary"
                            size={1}
                            onClick={() => deployMarket(market)}
                            disabled={status.status === "deploying"}
                          />
                        </Flex>
                      </Flex>

                      {status.error && (
                        <Box
                          padding={2}
                          style={{
                            backgroundColor: "#fee",
                            borderRadius: "4px",
                          }}
                        >
                          <Text size={1} style={{ color: "#c00" }}>
                            {status.error}
                          </Text>
                        </Box>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Grid>
          </Stack>

          {/* Deployment Overview */}
          {deploymentStatuses.length > 0 && (
            <Card padding={4} border radius={2} tone="transparent">
              <Stack space={3}>
                <Heading size={1}>Recent Deployments</Heading>
                {deploymentStatuses.map((status) => (
                  <Flex
                    key={status.market}
                    align="center"
                    justify="space-between"
                  >
                    <Text weight="medium">{status.market}</Text>
                    <Flex align="center" gap={2}>
                      <Badge tone={getStatusColor(status.status)}>
                        {status.status}
                      </Badge>
                      {getStatusIcon(status.status)}
                    </Flex>
                  </Flex>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
