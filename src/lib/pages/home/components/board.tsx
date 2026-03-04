import {
  SimpleGrid,
  type SimpleGridProps,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { CellState, PuzzleHistory } from "@/lib/shared/types";

import { Cell } from "./cell";

const BOX_SIZE: SimpleGridProps["width"] = {
  base: "6.438rem", // 103px
  sm: "9.813rem", // 157px
  md: "15.25rem", // 244px
};
const GRID_SIZE: SimpleGridProps["minWidth"] = {
  base: "19.563rem", // 313px
  sm: "29.688rem", // 475px
  md: "46rem", // 736px
};
const THICK_BORDER: SquareProps["border"] = "2px solid black";
// #endregion

// #region Box
type BoxProps = {
  cellStates: Array<CellState>;
  isMultiselectMode: boolean;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const Box = ({ cellStates, isMultiselectMode, setPuzzleHistory }: BoxProps) => (
  <SimpleGrid
    border={THICK_BORDER}
    columns={3}
    gap="0"
    height={BOX_SIZE}
    width={BOX_SIZE}
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
// #endregion

const getCellStatesGroupedByBox = (puzzleHistory: PuzzleHistory) => {
  const emptyBoxes: Array<Array<CellState>> = Array.from(
    { length: 9 },
    () => [],
  );

  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const cellStatesGroupedByBox = previousBoardState.reduce(
    (boxes, cellState) => {
      boxes[cellState.boxNumber - 1].push(cellState);
      return boxes;
    },
    emptyBoxes,
  );

  return cellStatesGroupedByBox;
};

type BoardProps = {
  isMultiselectMode: boolean;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const Board = ({
  isMultiselectMode,
  puzzleHistory,
  setPuzzleHistory,
}: BoardProps) => (
  <SimpleGrid
    border={THICK_BORDER}
    columns={3}
    gap="0"
    minHeight={GRID_SIZE}
    minWidth={GRID_SIZE}
  >
    {getCellStatesGroupedByBox(puzzleHistory).map((cellStates) => (
      <Box
        cellStates={cellStates}
        isMultiselectMode={isMultiselectMode}
        key={`${cellStates[0].boxNumber}`}
        setPuzzleHistory={setPuzzleHistory}
      />
    ))}
  </SimpleGrid>
);
