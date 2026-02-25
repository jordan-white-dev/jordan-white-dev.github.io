import {
  Button,
  type ButtonProps,
  SimpleGrid,
  type SimpleGridProps,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { BoardState, CellContent, CellState, PuzzleHistory } from "..";

// #region CSS Properties
const CELL_SIZE: SquareProps["minWidth"] = {
  base: "33px",
  sm: "3.188rem", // 51px
  md: "5rem", // 80px
};
const CELL_OUTLINE: ButtonProps["outline"] = {
  base: "3px solid #4ca4ff",
  sm: "5px solid #4ca4ff",
  md: "8px solid #4ca4ff",
};
const CELL_OUTLINE_OFFSET: ButtonProps["outlineOffset"] = {
  base: "-3px",
  sm: "-6px",
  md: "-9px",
};
const TEXT_STYLE: ButtonProps["textStyle"] = {
  base: "2xl",
  sm: "4xl",
  md: "6xl",
};
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
const THIN_BORDER: SquareProps["border"] = "1px solid black";
const THICK_BORDER: SquareProps["border"] = "2px solid black";
// #endregion

// #region Cell
type CellProps = {
  cellState: CellState;
  isMultiselectMode: boolean;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const Cell = ({
  cellState,
  isMultiselectMode,
  setPuzzleHistory,
}: CellProps) => {
  const getStartingOrPlayerDigitDisplayValue = (
    cellContent: CellContent,
  ): string => {
    if ("startingDigit" in cellContent) {
      return cellContent.startingDigit;
    } else if ("playerDigit" in cellContent) {
      return cellContent.playerDigit;
    }
    return "";
  };
  const displayValue = getStartingOrPlayerDigitDisplayValue(
    cellState.cellContent,
  );

  const digitColor =
    "startingDigit" in cellState.cellContent ? "black" : "#1d6ae5";

  const cellBackgroundColor =
    cellState.markupColors[0] !== "" ? cellState.markupColors : "transparent";

  const handleCellSelection = () => {
    setPuzzleHistory((currentPuzzleHistory) => {
      const currentBoardState =
        currentPuzzleHistory.boardStateHistory[
          currentPuzzleHistory.currentBoardStateIndex
        ];

      const selectedCells = currentBoardState.filter(
        (cellState) => cellState.isSelected,
      );

      const currentBoardStateUpdatedWithSelections: BoardState =
        currentBoardState.map((currentCellState) => {
          const isOnlySelectedCell =
            selectedCells.length === 1 &&
            selectedCells[0].cellNumber === cellState.cellNumber;

          const isSelectedInSingleSelectMode =
            currentCellState.cellNumber === cellState.cellNumber
              ? !isOnlySelectedCell
              : false;

          const isSelectedInMultiselectMode =
            currentCellState.cellNumber === cellState.cellNumber
              ? !currentCellState.isSelected
              : currentCellState.isSelected;

          const newIsSelected = isMultiselectMode
            ? isSelectedInMultiselectMode
            : isSelectedInSingleSelectMode;

          const newCellState = {
            ...currentCellState,
            isSelected: newIsSelected,
          };

          return newCellState;
        });

      const newBoardStateHistory = currentPuzzleHistory.boardStateHistory.map(
        (boardState, index) =>
          index === currentPuzzleHistory.currentBoardStateIndex
            ? currentBoardStateUpdatedWithSelections
            : boardState,
      );

      const newPuzzleHistory: PuzzleHistory = {
        currentBoardStateIndex: currentPuzzleHistory.currentBoardStateIndex,
        boardStateHistory: newBoardStateHistory,
      };

      return newPuzzleHistory;
    });
  };

  return (
    <Button
      backgroundColor={cellBackgroundColor}
      border={THIN_BORDER}
      borderRadius="0"
      color={digitColor}
      height={CELL_SIZE}
      minWidth={CELL_SIZE}
      padding="0"
      textStyle={TEXT_STYLE}
      width={CELL_SIZE}
      {...(cellState.isSelected && {
        outline: CELL_OUTLINE,
        outlineOffset: CELL_OUTLINE_OFFSET,
      })}
      onClick={handleCellSelection}
    >
      {displayValue}
    </Button>
  );
};
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

type CellStatesGroupedByBox = Array<Array<CellState>>;
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
  const emptyBoxes: CellStatesGroupedByBox = Array.from(
    { length: 9 },
    () => [],
  );

  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const cellStatesGroupedByBox = currentBoardState.reduce(
    (boxes, cellState) => {
      boxes[cellState.boxNumber - 1].push(cellState);
      return boxes;
    },
    emptyBoxes,
  );

  return (
    <SimpleGrid
      border={THICK_BORDER}
      columns={3}
      gap="0"
      minHeight={GRID_SIZE}
      minWidth={GRID_SIZE}
    >
      {cellStatesGroupedByBox.map((cellStates) => (
        <Box
          cellStates={cellStates}
          isMultiselectMode={isMultiselectMode}
          key={`${cellStates[0].boxNumber}`}
          setPuzzleHistory={setPuzzleHistory}
        />
      ))}
    </SimpleGrid>
  );
};
