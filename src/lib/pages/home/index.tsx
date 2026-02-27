import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useStopwatch } from "react-timer-hook";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";

const Home = () => {
  const { isRunning, minutes, seconds, pause, start, reset } = useStopwatch();
  const [isStayPausedMode, setIsStayPausedMode] = useState(false);

  const paddedSeconds =
    seconds.toString().length === 1
      ? `0${seconds.toString()}`
      : seconds.toString();

  const paddedMinutes =
    minutes.toString().length === 1
      ? `0${minutes.toString()}`
      : minutes.toString();

  const stopwatchTime = `${paddedMinutes}:${paddedSeconds}`;

  return (
    <>
      <Header
        isRunning={isRunning}
        isStayPausedMode={isStayPausedMode}
        stopwatchTime={stopwatchTime}
        pause={pause}
        reset={reset}
        setIsStayPausedMode={setIsStayPausedMode}
        start={start}
      />
      <Box width="full" as="main" justifyItems="center" marginY={22}>
        <Puzzle
          isStayPausedMode={isStayPausedMode}
          stopwatchTime={stopwatchTime}
          pause={pause}
          reset={reset}
          start={start}
        />
      </Box>
    </>
  );
};

export default Home;
