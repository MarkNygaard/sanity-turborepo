import { type SanityConfig } from "@sanity/sdk";
import { SanityApp } from "@sanity/sdk-react";
import { Flex, Spinner } from "@sanity/ui";

import { StudioDeploymentManager } from "./components/StudioDeploymentManager";
import { SanityUI } from "./SanityUI";

function App() {
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: "y69aqpxn",
      dataset: "production",
    },
  ];

  function Loading() {
    return (
      <Flex justify="center" align="center" width="100vw" height="fill">
        <Spinner />
      </Flex>
    );
  }

  return (
    <SanityUI>
      <SanityApp config={sanityConfigs} fallback={<Loading />}>
        <StudioDeploymentManager />
      </SanityApp>
    </SanityUI>
  );
}

export default App;
