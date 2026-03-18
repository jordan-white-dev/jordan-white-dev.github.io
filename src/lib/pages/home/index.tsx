import { Box } from "@chakra-ui/react";
import { useLoaderData } from "@tanstack/react-router";

import { UserSettingsProvider } from "@/lib/pages/home/hooks/use-user-settings";
import type { BoardState, RawBoardState } from "@/lib/pages/home/utils/types";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";
import { SudokuStopwatchProvider } from "./hooks/use-sudoku-stopwatch";

type LoaderData = {
  rawBoardState: RawBoardState;
  boardState: BoardState;
};

const Home = () => {
  const { rawBoardState, boardState } = useLoaderData({
    from: "/puzzle/$encoded",
  }) as LoaderData;

  return (
    <UserSettingsProvider>
      <SudokuStopwatchProvider
        key={JSON.stringify(rawBoardState)}
        rawBoardState={rawBoardState}
      >
        <Header />
        <Box width="full" as="main" justifyItems="center" marginY={22}>
          <Puzzle
            key={JSON.stringify(rawBoardState)}
            rawBoardState={rawBoardState}
            startingBoardState={boardState}
          />
        </Box>
      </SudokuStopwatchProvider>
    </UserSettingsProvider>
  );
};

export default Home;
