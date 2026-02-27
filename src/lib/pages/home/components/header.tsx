import { Flex } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { Stopwatch } from "./stopwatch";

type HeaderProps = {
  isRunning: boolean;
  isStayPausedMode: boolean;
  stopwatchTime: string;
  pause: () => void;
  reset: () => void;
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
  start: () => void;
};

export const Header = ({
  isRunning,
  isStayPausedMode,
  stopwatchTime,
  pause,
  setIsStayPausedMode,
  start,
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
      isRunning={isRunning}
      isStayPausedMode={isStayPausedMode}
      stopwatchTime={stopwatchTime}
      pause={pause}
      setIsStayPausedMode={setIsStayPausedMode}
      start={start}
    />
  </Flex>
);
