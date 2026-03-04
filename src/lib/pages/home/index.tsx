import { Box } from "@chakra-ui/react";
import { useLoaderData } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStopwatch } from "react-timer-hook";

import type { BoardState, RawBoardState } from "@/lib/shared/types";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";
import {
  StopwatchCommandsProvider,
  StopwatchTimeProvider,
} from "./components/stopwatch";

type LoaderData = {
  rawBoardState: RawBoardState;
  boardState: BoardState;
};

const Home = () => {
  const { rawBoardState, boardState } = useLoaderData({
    from: "/puzzle/$encoded",
  }) as LoaderData;

  const [isStayPausedMode, setIsStayPausedMode] = useState(false);

  const { hours, isRunning, minutes, seconds, pause, reset, start } =
    useStopwatch({
      interval: 500,
    });

  const stopwatchCommandsValue = useMemo(
    () => ({ pause, reset, start }),
    [pause, reset, start],
  );

  const stopwatchTimeValue = useMemo(() => {
    const getPaddedMinutes = () => {
      if (hours >= 1) {
        const hoursToMinutes = 60 * hours;
        const totalMinutes = minutes + hoursToMinutes;
        const paddedTotalMinutesAsString = `${String(totalMinutes).padStart(3, "0")}`;
        return paddedTotalMinutesAsString;
      } else return `${String(minutes).padStart(2, "0")}`;
    };

    const paddedMinutes = getPaddedMinutes();
    const paddedSeconds = `${String(seconds).padStart(2, "0")}`;
    const stopwatchTime = `${paddedMinutes}:${paddedSeconds}`;

    return { isRunning, stopwatchTime };
  }, [isRunning, hours, minutes, seconds]);

  return (
    <StopwatchCommandsProvider value={stopwatchCommandsValue}>
      <StopwatchTimeProvider value={stopwatchTimeValue}>
        <Header
          isStayPausedMode={isStayPausedMode}
          setIsStayPausedMode={setIsStayPausedMode}
        />
        <Box width="full" as="main" justifyItems="center" marginY={22}>
          <Puzzle
            key={JSON.stringify(rawBoardState)}
            isStayPausedMode={isStayPausedMode}
            rawBoardState={rawBoardState}
            startingBoardState={boardState}
          />
        </Box>
      </StopwatchTimeProvider>
    </StopwatchCommandsProvider>
  );
};

export default Home;
