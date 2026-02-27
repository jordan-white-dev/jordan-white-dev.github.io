import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useStopwatch } from "react-timer-hook";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";
import {
  StopwatchCommandsProvider,
  StopwatchTimeProvider,
} from "./components/stopwatch";

const Home = () => {
  const [isStayPausedMode, setIsStayPausedMode] = useState(false);

  const { isRunning, minutes, seconds, pause, reset, start } = useStopwatch({
    interval: 500,
  });

  const paddedMinutes = `${String(minutes).padStart(2, "0")}`;
  const paddedSeconds = `${String(seconds).padStart(2, "0")}`;
  const stopwatchTime = `${paddedMinutes}:${paddedSeconds}`;

  const stopwatchCommandsValue = useMemo(
    () => ({ pause, reset, start }),
    [pause, reset, start],
  );

  const stopwatchTimeValue = useMemo(
    () => ({
      isRunning,
      stopwatchTime,
    }),
    [isRunning, stopwatchTime],
  );

  return (
    <StopwatchCommandsProvider value={stopwatchCommandsValue}>
      <StopwatchTimeProvider value={stopwatchTimeValue}>
        <Header
          isStayPausedMode={isStayPausedMode}
          setIsStayPausedMode={setIsStayPausedMode}
        />
        <Box width="full" as="main" justifyItems="center" marginY={22}>
          <Puzzle isStayPausedMode={isStayPausedMode} />
        </Box>
      </StopwatchTimeProvider>
    </StopwatchCommandsProvider>
  );
};

export default Home;
