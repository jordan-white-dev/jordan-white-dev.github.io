import {
  Button,
  type ButtonProps,
  SimpleGrid,
  type SimpleGridProps,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { BoardState, CellContent, CellState, PuzzleHistory } from "..";
import { type MarkupColor, markupColors } from "./svgs";

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
const DIGIT_TEXT_STYLE: ButtonProps["textStyle"] = {
  base: "2xl",
  sm: "4xl",
  md: "6xl",
};
const CENTER_TEXT_STYLE_LENGTH_5_OR_LESS: ButtonProps["fontSize"] = {
  base: "0.625rem",
  sm: "0.875rem",
  md: "1.35rem",
};
const CENTER_TEXT_STYLE_LENGTH_6: ButtonProps["fontSize"] = {
  base: "0.5rem",
  sm: "0.75rem",
  md: "1.15rem",
};
const CENTER_TEXT_STYLE_LENGTH_7: ButtonProps["fontSize"] = {
  base: "0.4rem",
  sm: "0.625rem",
  md: "1rem",
};
const CENTER_TEXT_STYLE_LENGTH_8: ButtonProps["fontSize"] = {
  base: "0.375rem",
  sm: "0.55rem",
  md: "0.875rem",
};
const CENTER_TEXT_STYLE_LENGTH_9: ButtonProps["fontSize"] = {
  base: "0.345rem",
  sm: "0.475rem",
  md: "0.775rem",
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
  const getDisplayValue = (cellContent: CellContent): string => {
    if ("startingDigit" in cellContent) {
      return cellContent.startingDigit;
    } else if ("playerDigit" in cellContent) {
      return cellContent.playerDigit;
    } else if ("centerMarkups" in cellContent) {
      return cellContent.centerMarkups.sort().join("");
    }
    return "";
  };
  const displayValue = getDisplayValue(cellState.cellContent);

  const digitColor =
    "startingDigit" in cellState.cellContent ? "black" : "#1d6ae5";

  const getCellBackground = (
    cellMarkupColors: Array<MarkupColor> | [""],
  ): string => {
    const filteredColors = cellMarkupColors.filter(
      (markupColor) => markupColor !== "",
    );
    if (filteredColors.length === 0) return "transparent";

    const sortedColors = markupColors.filter((markupColor) =>
      filteredColors.includes(markupColor),
    );

    const sliceDegree = 360 / sortedColors.length;
    const gradientParts = sortedColors.map(
      (color, index) =>
        `${color} ${index * sliceDegree}deg ${(index + 1) * sliceDegree}deg`,
    );
    return `conic-gradient(${gradientParts.join(", ")})`;
  };

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

  const getFontSize = (): ButtonProps["fontSize"] => {
    if (
      "playerDigit" in cellState.cellContent ||
      "startingDigit" in cellState.cellContent
    ) {
      return DIGIT_TEXT_STYLE;
    } else if ("centerMarkups" in cellState.cellContent) {
      const centerMarkupsLength = cellState.cellContent.centerMarkups.length;

      switch (centerMarkupsLength) {
        case 9:
          return CENTER_TEXT_STYLE_LENGTH_9;
        case 8:
          return CENTER_TEXT_STYLE_LENGTH_8;
        case 7:
          return CENTER_TEXT_STYLE_LENGTH_7;
        case 6:
          return CENTER_TEXT_STYLE_LENGTH_6;
        default:
          return CENTER_TEXT_STYLE_LENGTH_5_OR_LESS;
      }
    }
  };

  return (
    <Button
      background={getCellBackground(cellState.markupColors)}
      border={THIN_BORDER}
      borderRadius="0"
      color={digitColor}
      height={CELL_SIZE}
      minWidth={CELL_SIZE}
      padding="0"
      fontSize={getFontSize()}
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
