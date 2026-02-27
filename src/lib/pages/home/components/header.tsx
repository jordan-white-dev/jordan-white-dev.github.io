import { Flex } from "@chakra-ui/react";

import { Stopwatch } from "./stopwatch";

export const Header = () => (
  <Flex
    align="start"
    as="header"
    backgroundColor="gray.fg"
    height="fit-content"
    justifyContent="right"
    padding="0.625rem 1rem"
    width="full"
  >
    <Stopwatch />
  </Flex>
);
