import {
  Card,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";

import { useMarkets } from "../hooks/useMarkets";

export function MarketList() {
  const { markets, isPending } = useMarkets();

  if (isPending) {
    return (
      <Flex justify="center" align="center" height="fill">
        <Spinner />
      </Flex>
    );
  }

  console.log("markets", markets);

  return (
    <Container width={1}>
      <Card padding={5} shadow={2} radius={3} marginY={5}>
        <Heading as="h2" size={2}>
          Markets
        </Heading>
        <Stack space={4}>
          {markets.length === 0 ? (
            <Text muted>No markets found.</Text>
          ) : (
            markets.map((market, i) => {
              if (!market) return null;
              return (
                <Card key={market._id} padding={3} radius={2} shadow={1}>
                  <Flex direction="column" gap={2}>
                    <Flex align="center" justify="space-between">
                      <Text weight="semibold">
                        {market.title} ({market.code})
                      </Text>
                      <Text size={1} muted>
                        {market.languages.length} languages
                      </Text>
                    </Flex>
                    <Text size={1}>
                      Languages:{" "}
                      {market.languages.map((lang) => lang.title).join(", ")}
                    </Text>
                  </Flex>
                </Card>
              );
            })
          )}
        </Stack>
      </Card>
    </Container>
  );
}
