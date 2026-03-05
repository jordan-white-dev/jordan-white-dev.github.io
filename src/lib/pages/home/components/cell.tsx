import {
  Button,
  type ButtonProps,
  Float,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { memo } from "react";

import {
  getStartingOrPlayerDigitInCellIfPresent,
  isCenterMarkupsInCellContent,
  isCornerMarkupsInCellContent,
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
  isStartingOrPlayerDigitInCellContent,
} from "@/lib/shared/constants";
import {
  type BoardState,
  type CellContent,
  type CellState,
  type MarkupColor,
  type MarkupDigits,
  type MarkupDigitsCellContent,
  markupColors,
  type PuzzleHistory,
  type SudokuDigit,
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
const THIN_BORDER: SquareProps["border"] = "1px solid black";
// #endregion

// #region Functions
const getNonCornerDigitsInCellAsString = (cellContent: CellContent): string => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else if (isCenterMarkupsInCellContent(cellContent))
    return cellContent.centerMarkups.sort().join("");
  else return "";
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

const getFontSize = (cellContent: CellContent): ButtonProps["fontSize"] => {
  if (isStartingOrPlayerDigitInCellContent(cellContent)) {
    return DIGIT_TEXT_STYLE;
  } else if (isCenterMarkupsInCellContent(cellContent)) {
    const centerMarkupsLength = cellContent.centerMarkups.length;

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

// #region Float Handling
const getCornerMarkups = (cellContent: CellContent): Array<string> => {
  if (
    isCornerMarkupsInCellContent(cellContent) &&
    cellContent.cornerMarkups[0] !== ""
  ) {
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
// #endregion

// #region Handle Click
const handleCellClick = (
  cellNumber: number,
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
            previousCellState.cellNumber === cellNumber
              ? !previousCellState.isSelected
              : previousCellState.isSelected;

          const newCellState = {
            ...previousCellState,
            isSelected: isSelected,
          };

          return newCellState;
        } else {
          const isThisTheOnlySelectedCell =
            selectedCells.length === 1 &&
            selectedCells[0].cellNumber === cellNumber;

          const isSelected =
            previousCellState.cellNumber === cellNumber
              ? !isThisTheOnlySelectedCell
              : false;

          const newCellState = {
            ...previousCellState,
            isSelected: isSelected,
          };

          return newCellState;
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
// #endregion

// #region Handle Double Click
const isCellAnEmptyPlayerDigitWithNoColorMarkups = (cellState: CellState) => {
  const cellContent = cellState.cellContent;

  if (isStartingDigitInCellContent(cellContent)) return false;
  else if (
    isPlayerDigitInCellContent(cellContent) &&
    cellContent.playerDigit !== ""
  )
    return false;
  else if (
    isCornerMarkupsInCellContent(cellContent) &&
    cellContent.cornerMarkups[0] !== ""
  )
    return false;
  else if (
    isCenterMarkupsInCellContent(cellContent) &&
    cellContent.centerMarkups[0] !== ""
  )
    return false;
  else if (cellState.markupColors[0] !== "") return false;

  return true;
};

const isArrayOfMarkupColors = (
  array: [""] | Array<MarkupColor>,
): array is Array<MarkupColor> => array[0] !== "";

const getUpdatedCellStateIfMatchingMarkupColorsExist = (
  markupColors: [""] | Array<MarkupColor>,
  previousMarkupColors: [""] | Array<MarkupColor>,
  previousCellState: CellState,
): CellState => {
  const doBothCellsContainAtLeastOneMatchingMarkupColor =
    isArrayOfMarkupColors(markupColors) &&
    isArrayOfMarkupColors(previousMarkupColors) &&
    markupColors.some((markupColor) =>
      previousMarkupColors.includes(markupColor),
    );

  if (doBothCellsContainAtLeastOneMatchingMarkupColor) {
    return {
      ...previousCellState,
      isSelected: true,
    };
  }

  return previousCellState;
};

const isArrayOfSudokuDigits = (
  array: MarkupDigits,
): array is Array<SudokuDigit> => array[0] !== "";

const doBothCellsContainAtLeastOneMatchingMarkup = (
  cellContent: MarkupDigits,
  previousCellContent: MarkupDigits,
): boolean => {
  const doBothCellsContainAtLeastOneMatchingMarkup =
    isArrayOfSudokuDigits(cellContent) &&
    isArrayOfSudokuDigits(previousCellContent) &&
    cellContent.some((markupDigit) =>
      previousCellContent.includes(markupDigit),
    );

  return doBothCellsContainAtLeastOneMatchingMarkup;
};

const getUpdatedCellStateIfMatchingMarkupDigitsExist = (
  cellContent: MarkupDigitsCellContent,
  previousCellContent: MarkupDigitsCellContent,
  previousCellState: CellState,
): CellState => {
  const doBothCellsContainAtLeastOneMatchingMarkupDigit =
    doBothCellsContainAtLeastOneMatchingMarkup(
      cellContent.centerMarkups,
      previousCellContent.centerMarkups,
    ) ||
    doBothCellsContainAtLeastOneMatchingMarkup(
      cellContent.cornerMarkups,
      previousCellContent.cornerMarkups,
    );

  if (doBothCellsContainAtLeastOneMatchingMarkupDigit) {
    const newCellState = {
      ...previousCellState,
      isSelected: true,
    };
    return newCellState;
  }

  return previousCellState;
};

const getNewCellStateWithUpdatedCellSelections = (
  cellState: CellState,
  previousCellState: CellState,
): CellState => {
  if (isCellAnEmptyPlayerDigitWithNoColorMarkups(previousCellState))
    return previousCellState;

  const cellContent = cellState.cellContent;
  const previousCellContent = previousCellState.cellContent;

  if (
    cellState.markupColors[0] !== "" &&
    previousCellState.markupColors[0] !== ""
  ) {
    const newCellState = getUpdatedCellStateIfMatchingMarkupColorsExist(
      cellState.markupColors,
      previousCellState.markupColors,
      previousCellState,
    );
    return newCellState;
  } else if (
    isCenterMarkupsInCellContent(cellContent) &&
    isCenterMarkupsInCellContent(previousCellContent)
  ) {
    const newCellState = getUpdatedCellStateIfMatchingMarkupDigitsExist(
      cellContent,
      previousCellContent,
      previousCellState,
    );
    return newCellState;
  } else if (
    isStartingOrPlayerDigitInCellContent(cellContent) &&
    isStartingOrPlayerDigitInCellContent(previousCellContent) &&
    getStartingOrPlayerDigitInCellIfPresent(cellContent) ===
      getStartingOrPlayerDigitInCellIfPresent(previousCellContent)
  ) {
    const newCellState = {
      ...previousCellState,
      isSelected: true,
    };
    return newCellState;
  }

  return previousCellState;
};

const handleCellDoubleClick = (
  cellState: CellState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const newBoardStateWithUpdatedCellSelections: BoardState =
      previousBoardState.map((previousCellState) =>
        getNewCellStateWithUpdatedCellSelections(cellState, previousCellState),
      );

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
// #endregion

// #endregion

type CellProps = {
  cellState: CellState;
  isMultiselectMode: boolean;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const Cell = memo(
  ({ cellState, isMultiselectMode, setPuzzleHistory }: CellProps) => {
    const cellContent = cellState.cellContent;

    const nonCornerDigitsInCellAsString =
      getNonCornerDigitsInCellAsString(cellContent);

    const cornerMarkups = getCornerMarkups(cellContent);

    const cornerMarkupFloats = getCornerMarkupFloats(cornerMarkups);

    return (
      <Button
        background={getCellBackground(cellState.markupColors)}
        border={THIN_BORDER}
        borderRadius="0"
        color={isStartingDigitInCellContent(cellContent) ? "black" : "#1d6ae5"}
        fontSize={getFontSize(cellContent)}
        height={CELL_SIZE}
        minWidth={CELL_SIZE}
        padding="0"
        textShadow={{
          sm: "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff",
        }}
        width={CELL_SIZE}
        {...(cellState.isSelected && {
          outline: CELL_OUTLINE,
          outlineOffset: CELL_OUTLINE_OFFSET,
        })}
        onClick={() =>
          handleCellClick(
            cellState.cellNumber,
            isMultiselectMode,
            setPuzzleHistory,
          )
        }
        onDoubleClick={() => handleCellDoubleClick(cellState, setPuzzleHistory)}
      >
        {cornerMarkupFloats}
        {nonCornerDigitsInCellAsString}
      </Button>
    );
  },
);
