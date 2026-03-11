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
  isMarkupDigitsInCellContent,
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

import { useUserSettings } from "..";

// #region CSS Properties
const CELL_SIZE: SquareProps["minWidth"] = {
  base: "33px",
  sm: "3.188rem", // 51px
  md: "5rem", // 80px
};
const CELL_SELECTION_BOX_SHADOW: ButtonProps["boxShadow"] = {
  base: "inset 0 0 0 3px #4ca4ff",
  sm: "inset 0 0 0 5px #4ca4ff",
  md: "inset 0 0 0 8px #4ca4ff",
};
const DIGIT_FONT_SIZE: ButtonProps["fontSize"] = {
  base: "2xl",
  sm: "4xl",
  md: "6xl",
};
const CORNER_AND_LABEL_FONT_SIZE: ButtonProps["fontSize"] = {
  base: "0.5rem",
  sm: "0.875rem",
  md: "1.35rem",
};
const CENTER_FONT_SIZE_LENGTH_5_OR_LESS: ButtonProps["fontSize"] = {
  base: "0.525rem",
  sm: "0.8rem",
  md: "1.35rem",
};
const CENTER_FONT_SIZE_LENGTH_6: ButtonProps["fontSize"] = {
  base: "0.425rem",
  sm: "0.675rem",
  md: "1.1rem",
};
const CENTER_FONT_SIZE_LENGTH_7: ButtonProps["fontSize"] = {
  base: "0.375rem",
  sm: "0.575rem",
  md: "0.95rem",
};
const CENTER_FONT_SIZE_LENGTH_8: ButtonProps["fontSize"] = {
  base: "0.33rem",
  sm: "0.5rem",
  md: "0.825rem",
};
const CENTER_FONT_SIZE_LENGTH_9: ButtonProps["fontSize"] = {
  base: "0.3rem",
  sm: "0.455rem",
  md: "0.725rem",
};
const DIGIT_TEXT_SHADOW: ButtonProps["textShadow"] = {
  base: "1px 1px 0 #fff",
  sm: "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff",
};
const MARKUP_TEXT_SHADOW: ButtonProps["textShadow"] = {
  base: "none",
  sm: "1px 0 0 #fff",
};
// #endregion

// #region Functions
const getNonCornerDigitsInCellAsString = (cellContent: CellContent): string => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else if (isMarkupDigitsInCellContent(cellContent))
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
    return DIGIT_FONT_SIZE;
  } else if (isMarkupDigitsInCellContent(cellContent)) {
    const centerMarkupsLength = cellContent.centerMarkups.length;

    switch (centerMarkupsLength) {
      case 9:
        return CENTER_FONT_SIZE_LENGTH_9;
      case 8:
        return CENTER_FONT_SIZE_LENGTH_8;
      case 7:
        return CENTER_FONT_SIZE_LENGTH_7;
      case 6:
        return CENTER_FONT_SIZE_LENGTH_6;
      default:
        return CENTER_FONT_SIZE_LENGTH_5_OR_LESS;
    }
  }
};

const getTextShadow = (cellContent: CellContent): ButtonProps["textShadow"] =>
  isMarkupDigitsInCellContent(cellContent) &&
  cellContent.centerMarkups[0] !== ""
    ? MARKUP_TEXT_SHADOW
    : DIGIT_TEXT_SHADOW;

const getCellBorderStyles = (
  columnNumber: number,
  dashedGridSetting: boolean,
  rowNumber: number,
) => {
  const isCellOnBottomBoxEdge = rowNumber % 3 === 0;
  const isCellOnLeftBoxEdge = columnNumber % 3 === 1;
  const isCellOnRightBoxEdge = columnNumber % 3 === 0;
  const isCellOnTopBoxEdge = rowNumber % 3 === 1;

  return {
    borderBottomStyle:
      !isCellOnBottomBoxEdge && dashedGridSetting ? "dashed" : "solid",
    borderLeftStyle:
      !isCellOnLeftBoxEdge && dashedGridSetting ? "dashed" : "solid",
    borderRightStyle:
      !isCellOnRightBoxEdge && dashedGridSetting ? "dashed" : "solid",
    borderTopStyle:
      !isCellOnTopBoxEdge && dashedGridSetting ? "dashed" : "solid",
  };
};

const getCellBorderWidths = (columnNumber: number, rowNumber: number) => {
  const isCellOnLeftBoxEdge = columnNumber % 3 === 1;
  const isCellOnTopBoxEdge = rowNumber % 3 === 1;

  return {
    borderBottomWidth: "2px",
    borderLeftWidth: isCellOnLeftBoxEdge ? "2px" : "0",
    borderRightWidth: "2px",
    borderTopWidth: isCellOnTopBoxEdge ? "2px" : "0",
  };
};

// #region Float Handling
const getCornerMarkups = (cellContent: CellContent): Array<string> => {
  if (
    isMarkupDigitsInCellContent(cellContent) &&
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
          fontSize={CORNER_AND_LABEL_FONT_SIZE}
          key={cornerMarkup}
          offsetX={{ base: "1.5", sm: "2.5", md: "4" }}
          offsetY={{ base: "0.438rem", sm: "3", md: "5" }}
          placement={placement}
          textShadow={MARKUP_TEXT_SHADOW}
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

const getRowLabelFloat = (labelNumber: number): ReactNode => {
  return (
    <Float
      color="black"
      fontSize={CORNER_AND_LABEL_FONT_SIZE}
      key={`row-label-${labelNumber}`}
      offsetX={{ base: "-8px", md: "-15px" }}
      placement="middle-start"
    >
      {labelNumber.toString()}
    </Float>
  );
};

const getColumnLabelFloat = (labelNumber: number): ReactNode => {
  return (
    <Float
      color="black"
      fontSize={CORNER_AND_LABEL_FONT_SIZE}
      key={`column-label-${labelNumber}`}
      offsetY={{ base: "-8px", sm: "-12px", md: "-15px" }}
      placement="top-center"
    >
      {labelNumber.toString()}
    </Float>
  );
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
        }

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
    isMarkupDigitsInCellContent(cellContent) &&
    cellContent.cornerMarkups[0] !== ""
  )
    return false;
  else if (
    isMarkupDigitsInCellContent(cellContent) &&
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
    isMarkupDigitsInCellContent(cellContent) &&
    isMarkupDigitsInCellContent(previousCellContent)
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
    const boardStateWithClearedCellSelections: BoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ].map((previousCellState) => {
        const updatedCellState = {
          ...previousCellState,
          isSelected: false,
        };

        return updatedCellState;
      });

    const newBoardStateWithUpdatedCellSelections: BoardState =
      boardStateWithClearedCellSelections.map((previousCellState) =>
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
    const { userSettings } = useUserSettings();
    const showRowAndColumnLabels = userSettings.showRowAndColumnLabels;

    const cellContent = cellState.cellContent;

    const nonCornerDigitsInCellAsString =
      getNonCornerDigitsInCellAsString(cellContent);

    const cornerMarkups = getCornerMarkups(cellContent);
    const cornerMarkupFloats = getCornerMarkupFloats(cornerMarkups);

    return (
      <Button
        background={getCellBackground(cellState.markupColors)}
        borderColor="black"
        borderRadius="0"
        color={isStartingDigitInCellContent(cellContent) ? "black" : "#1212f0"}
        fontSize={getFontSize(cellContent)}
        height={CELL_SIZE}
        minWidth={CELL_SIZE}
        padding="0"
        textShadow={getTextShadow(cellContent)}
        transition="none"
        width={CELL_SIZE}
        {...getCellBorderStyles(
          cellState.columnNumber,
          userSettings.dashedGrid,
          cellState.rowNumber,
        )}
        {...getCellBorderWidths(cellState.columnNumber, cellState.rowNumber)}
        {...(cellState.isSelected && {
          boxShadow: CELL_SELECTION_BOX_SHADOW,
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
        {showRowAndColumnLabels &&
          cellState.columnNumber === 1 &&
          getRowLabelFloat(cellState.rowNumber)}
        {showRowAndColumnLabels &&
          cellState.rowNumber === 1 &&
          getColumnLabelFloat(cellState.columnNumber)}
        {cornerMarkupFloats}
        {nonCornerDigitsInCellAsString}
      </Button>
    );
  },
);
