import { Box } from "@chakra-ui/react";
import { useLoaderData } from "@tanstack/react-router";

import type { BoardState, RawBoardState } from "@/lib/shared/types";
import { UserSettingsProvider } from "@/lib/utils/useUserSettings";

import { SudokuStopwatchProvider } from "../../utils/useSudokuStopwatch";
import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";

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
      <SudokuStopwatchProvider>
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
