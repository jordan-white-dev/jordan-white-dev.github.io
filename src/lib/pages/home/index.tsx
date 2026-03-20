import { Box } from "@chakra-ui/react";

import { UserSettingsProvider } from "@/lib/pages/home/hooks/use-user-settings";
import { Route } from "@/routes/puzzle.$encodedPuzzleString";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";
import { SudokuStopwatchProvider } from "./hooks/use-sudoku-stopwatch";

const Home = () => {
  const { boardState, rawBoardState } = Route.useLoaderData();

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
