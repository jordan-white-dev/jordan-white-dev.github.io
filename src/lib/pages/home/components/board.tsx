import { SimpleGrid } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { PuzzleHistory } from "@/lib/shared/types";

import { Cell } from "./cell";

type BoardProps = {
  isMultiselectMode: boolean;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const Board = ({
  isMultiselectMode,
  puzzleHistory,
  setPuzzleHistory,
}: BoardProps) => {
  const cellStates =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  return (
    <SimpleGrid
      border="2px solid black"
      columns={9}
      gap="0"
      minWidth={{
        base: "301px",
        sm: "463px",
        md: "724px",
      }}
    >
      {cellStates.map((cellState) => (
        <Cell
          cellState={cellState}
          isMultiselectMode={isMultiselectMode}
          key={cellState.cellNumber}
          setPuzzleHistory={setPuzzleHistory}
        />
      ))}
    </SimpleGrid>
  );
};
