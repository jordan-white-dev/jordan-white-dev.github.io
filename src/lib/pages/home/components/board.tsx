import {
  Button,
  type ButtonProps,
  Float,
  SimpleGrid,
  type SimpleGridProps,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { memo } from "react";

import {
  type BoardState,
  type CellContent,
  type CellState,
  type MarkupColor,
  markupColors,
  type PuzzleHistory,
} from "@/lib/shared/types";

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
const getNonCornerDisplayValue = (cellContent: CellContent): string => {
  if ("startingDigit" in cellContent) {
    return cellContent.startingDigit;
  } else if ("playerDigit" in cellContent) {
    return cellContent.playerDigit;
  } else if ("centerMarkups" in cellContent) {
    return cellContent.centerMarkups.sort().join("");
  }
  return "";
};

const getCornerMarkups = (cellContent: CellContent): Array<string> => {
  if ("cornerMarkups" in cellContent && cellContent.cornerMarkups[0] !== "") {
    const sortedCornerMarkups = cellContent.cornerMarkups.sort();
    return sortedCornerMarkups;
  } else return [""];
};

const floatPlacements = [
  "top-start",
  "top-center",
  "top-end",
  "middle-start",
  "middle-center",
  "middle-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
] as const;

type FloatPlacement = (typeof floatPlacements)[number];

const floatPlacementOrdersByMarkupAmount: Record<
  number,
  ReadonlyArray<number>
> = {
  1: [0],
  2: [0, 2],
  3: [0, 2, 6],
  4: [0, 2, 6, 8],
  5: [0, 1, 2, 6, 8],
  6: [0, 1, 2, 6, 7, 8],
  7: [0, 1, 2, 3, 6, 7, 8],
  8: [0, 1, 2, 3, 5, 6, 7, 8],
  9: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

const getFloatPlacement = (
  cornerMarkupsLength: number,
  cornerMarkupsIndex: number,
): FloatPlacement => {
  const floatPlacementOrder =
    floatPlacementOrdersByMarkupAmount[cornerMarkupsLength] ??
    floatPlacementOrdersByMarkupAmount[9];
  return floatPlacements[floatPlacementOrder[cornerMarkupsIndex]];
};

const getCornerMarkupFloats = (
  cornerMarkups: Array<string>,
): Array<ReactNode> | undefined => {
  if (cornerMarkups.length === 0 || cornerMarkups[0] === "") return undefined;

  const cornerMarkupFloats = cornerMarkups.reduce<Array<ReactNode>>(
    (floats, cornerMarkup, index) => {
      const placement = getFloatPlacement(cornerMarkups.length, index);

      floats.push(
        <Float
          key={cornerMarkup}
          offsetX={{ base: "1.5", sm: "2.5", md: "4" }}
          offsetY={{ base: "0.438rem", sm: "3", md: "5" }}
          placement={placement}
        >
          {cornerMarkup}
        </Float>,
      );

      return floats;
    },
    [],
  );

  return cornerMarkupFloats;
};

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

const getFontSize = (cellState: CellState): ButtonProps["fontSize"] => {
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

const handleCellClick = (
  targetCellState: CellState,
  isMultiselectMode: boolean,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const selectedCells = previousBoardState.filter(
      (previousCellState) => previousCellState.isSelected,
    );

    const newBoardStateWithUpdatedCellSelections: BoardState =
      previousBoardState.map((previousCellState) => {
        if (isMultiselectMode) {
          const isSelected =
            previousCellState.cellNumber === targetCellState.cellNumber
              ? !previousCellState.isSelected
              : previousCellState.isSelected;

          const cellState = {
            ...previousCellState,
            isSelected: isSelected,
          };

          return cellState;
        } else {
          const isThisTheOnlySelectedCell =
            selectedCells.length === 1 &&
            selectedCells[0].cellNumber === targetCellState.cellNumber;

          const isSelected =
            previousCellState.cellNumber === targetCellState.cellNumber
              ? !isThisTheOnlySelectedCell
              : false;

          const cellState = {
            ...previousCellState,
            isSelected: isSelected,
          };

          return cellState;
        }
      });

    const newBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (previousBoardState, index) =>
        index === previousPuzzleHistory.currentBoardStateIndex
          ? newBoardStateWithUpdatedCellSelections
          : previousBoardState,
    );

    const newPuzzleHistory: PuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: newBoardStateHistory,
    };

    return newPuzzleHistory;
  });
};

type CellProps = {
  cellState: CellState;
  isMultiselectMode: boolean;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const Cell = memo(
  ({ cellState, isMultiselectMode, setPuzzleHistory }: CellProps) => {
    const nonCornerDisplayValue = getNonCornerDisplayValue(
      cellState.cellContent,
    );

    const cornerMarkups = getCornerMarkups(cellState.cellContent);

    const cornerMarkupFloats = getCornerMarkupFloats(cornerMarkups);

    return (
      <Button
        background={getCellBackground(cellState.markupColors)}
        border={THIN_BORDER}
        borderRadius="0"
        color={"startingDigit" in cellState.cellContent ? "black" : "#1d6ae5"}
        height={CELL_SIZE}
        minWidth={CELL_SIZE}
        padding="0"
        fontSize={getFontSize(cellState)}
        width={CELL_SIZE}
        {...(cellState.isSelected && {
          outline: CELL_OUTLINE,
          outlineOffset: CELL_OUTLINE_OFFSET,
        })}
        onClick={() =>
          handleCellClick(cellState, isMultiselectMode, setPuzzleHistory)
        }
      >
        {cornerMarkupFloats}
        {nonCornerDisplayValue}
      </Button>
    );
  },
);
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
