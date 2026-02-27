import { Flex } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { Stopwatch } from "./stopwatch";

type HeaderProps = {
  isStayPausedMode: boolean;
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({
  isStayPausedMode,
  setIsStayPausedMode,
}: HeaderProps) => (
  <Flex
    align="start"
    as="header"
    backgroundColor="gray.fg"
    height="fit-content"
    justifyContent="right"
    padding="0.625rem 1rem"
    width="full"
  >
    <Stopwatch
      isStayPausedMode={isStayPausedMode}
      setIsStayPausedMode={setIsStayPausedMode}
    />
  </Flex>
);
