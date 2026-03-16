import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import useSessionStorageState from "use-session-storage-state";

import type {
  BoardState,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { Board } from "./board";
import { PlayerInterface } from "./player-interface";

type PuzzleProps = {
  rawBoardState: RawBoardState;
  startingBoardState: BoardState;
};

export const Puzzle = memo(
  ({ rawBoardState, startingBoardState }: PuzzleProps) => {
    const [isMultiselectMode, setIsMultiselectMode] =
      useSessionStorageState<boolean>(
        `multiselect-mode-${JSON.stringify(rawBoardState)}`,
        {
          defaultValue: false,
        },
      );
    const [puzzleHistory, setPuzzleHistory] =
      useSessionStorageState<PuzzleHistory>(
        `puzzle-history-${JSON.stringify(rawBoardState)}`,
        {
          defaultValue: {
            currentBoardStateIndex: 0,
            boardStateHistory: [startingBoardState],
          },
        },
      );

    return (
      <Flex
        alignItems="center"
        direction={{ base: "column", lg: "row" }}
        fontFamily="sans-serif"
        gap={{ base: "4", md: "8" }}
        marginTop={{ sm: "2.5" }}
      >
        <Board
          isMultiselectMode={isMultiselectMode}
          puzzleHistory={puzzleHistory}
          setPuzzleHistory={setPuzzleHistory}
        />
        <PlayerInterface
          isMultiselectMode={isMultiselectMode}
          puzzleHistory={puzzleHistory}
          rawBoardState={rawBoardState}
          setIsMultiselectMode={setIsMultiselectMode}
          setPuzzleHistory={setPuzzleHistory}
        />
      </Flex>
    );
  },
);
