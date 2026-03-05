import { Flex } from "@chakra-ui/react";
import { memo, useState } from "react";

import type {
  BoardState,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { Board } from "./board";
import { PlayerInterface } from "./player-interface";

type PuzzleProps = {
  isStayPausedMode: boolean;
  rawBoardState: RawBoardState;
  startingBoardState: BoardState;
};

export const Puzzle = memo(
  ({ isStayPausedMode, rawBoardState, startingBoardState }: PuzzleProps) => {
    const [isMultiselectMode, setIsMultiselectMode] = useState(false);
    const [puzzleHistory, setPuzzleHistory] = useState<PuzzleHistory>({
      currentBoardStateIndex: 0,
      boardStateHistory: [startingBoardState],
    });

    return (
      <Flex
        alignItems="center"
        direction={{ base: "column", lg: "row" }}
        fontFamily="sans-serif"
        gap={{ base: "4", md: "8" }}
      >
        <Board
          isMultiselectMode={isMultiselectMode}
          puzzleHistory={puzzleHistory}
          setPuzzleHistory={setPuzzleHistory}
        />
        <PlayerInterface
          isMultiselectMode={isMultiselectMode}
          isStayPausedMode={isStayPausedMode}
          puzzleHistory={puzzleHistory}
          rawBoardState={rawBoardState}
          setIsMultiselectMode={setIsMultiselectMode}
          setPuzzleHistory={setPuzzleHistory}
        />
      </Flex>
    );
  },
);
