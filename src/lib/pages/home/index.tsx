import { Box } from "@chakra-ui/react";
import { useState } from "react";
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
    interval: 20,
  });

  const paddedMinutes = `${String(minutes).padStart(2, "0")}`;
  const paddedSeconds = `${String(seconds).padStart(2, "0")}`;
  const stopwatchTime = `${paddedMinutes}:${paddedSeconds}`;

  return (
    <StopwatchCommandsProvider value={{ pause, reset, start }}>
      <StopwatchTimeProvider value={{ isRunning, stopwatchTime }}>
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
