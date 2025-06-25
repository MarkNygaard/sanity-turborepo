import { type SanityConfig } from "@sanity/sdk";
import { SanityApp } from "@sanity/sdk-react";
import { Flex, Spinner } from "@sanity/ui";

import { MarketList } from "./components/MarketList";
import { StudioDeploymentManager } from "./components/StudioDeploymentManager";
import { SanityUI } from "./SanityUI";

function App() {
  // apps can access many different projects or other sources of data
  const sanityConfigs: SanityConfig[] = [
    {
      projectId: "y69aqpxn",
      dataset: "production",
    },
  ];

  console.log(
    "Sanity config:",
    import.meta.env.VITE_SANITY_PROJECT_ID,
    import.meta.env.VITE_SANITY_DATASET,
  );

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
        {/* <MarketList /> */}
      </SanityApp>
    </SanityUI>
  );
}

export default App;
