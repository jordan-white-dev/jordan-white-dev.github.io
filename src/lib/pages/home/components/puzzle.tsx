import { Flex } from "@chakra-ui/react";
import { memo, useState } from "react";

import { getNewStartingBoardStates } from "@/lib/shared/constants";
import type { InputMode, PuzzleHistory } from "@/lib/shared/types";

import { Board } from "./board";
import { PlayerInterface } from "./playerinterface";

type PuzzleProps = {
  isStayPausedMode: boolean;
};

export const Puzzle = memo(({ isStayPausedMode }: PuzzleProps) => {
  const [newStartingBoardStates] = useState(() => getNewStartingBoardStates());
  const [startingRawBoardState, setStartingRawBoardState] = useState(
    newStartingBoardStates.rawBoardState,
  );
  const [inputMode, setInputMode] = useState<InputMode>("Digit");
  const [isMultiselectMode, setIsMultiselectMode] = useState(false);
  const [puzzleHistory, setPuzzleHistory] = useState<PuzzleHistory>({
    currentBoardStateIndex: 0,
    boardStateHistory: [newStartingBoardStates.boardState],
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
});
