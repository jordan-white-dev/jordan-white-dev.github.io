import { Flex } from "@chakra-ui/react";
import { type Dispatch, memo, type SetStateAction, useState } from "react";

import type {
  BoardState,
  InputMode,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { Board } from "./board";
import { PlayerInterface } from "./playerinterface";

type PuzzleProps = {
  isStayPausedMode: boolean;
  startingBoardState: BoardState;
  startingRawBoardState: RawBoardState;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
};

export const Puzzle = memo(
  ({
    isStayPausedMode,
    startingBoardState,
    startingRawBoardState,
    setStartingRawBoardState,
  }: PuzzleProps) => {
    const [inputMode, setInputMode] = useState<InputMode>("Digit");
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
          inputMode={inputMode}
          isMultiselectMode={isMultiselectMode}
          isStayPausedMode={isStayPausedMode}
          puzzleHistory={puzzleHistory}
          startingRawBoardState={startingRawBoardState}
          setInputMode={setInputMode}
          setIsMultiselectMode={setIsMultiselectMode}
          setPuzzleHistory={setPuzzleHistory}
          setStartingRawBoardState={setStartingRawBoardState}
        />
      </Flex>
    );
  },
);
