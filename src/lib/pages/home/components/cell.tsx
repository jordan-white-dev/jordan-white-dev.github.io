import {
  Button,
  type ButtonProps,
  Float,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { memo } from "react";

import { useUserSettings } from "@/lib/pages/home/hooks/use-user-settings";
import {
  getStartingOrPlayerDigitInCellIfPresent,
  isArrayOfMarkupColors,
  isArrayOfSudokuDigits,
  isMarkupDigitsInCellContent,
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
  isStartingOrPlayerDigitInCellContent,
} from "@/lib/pages/home/utils/constants";
import {
  type BoardState,
  type CellContent,
  type CellState,
  type MarkupColor,
  type MarkupDigits,
  type MarkupDigitsCellContent,
  markupColors,
  type PuzzleHistory,
} from "@/lib/pages/home/utils/types";

// #region CSS Properties

// Backgrounds
const CONFLICT_CELL_COLOR = "rgb(179, 58, 58)";
const CONFLICT_CELL_OPACITY = 0.65;

const SEEN_CELL_OPACITY = 0.25;
const SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS = 8;
const SEEN_CELL_COLOR = "#ffd700";

const SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS = 8;
const SELECTED_CELL_COLOR = "#4ca4ff";

// Cell Size
const CELL_SIZE: SquareProps["minWidth"] = {
  base: "33px",
  sm: "3.188rem", // 51px
  md: "5rem", // 80px
};

// Font Size
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

// Text Shadow
const DIGIT_TEXT_SHADOW: ButtonProps["textShadow"] = {
  base: "1px 1px 0 #fff",
  sm: "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff",
};
const MARKUP_TEXT_SHADOW: ButtonProps["textShadow"] = {
  base: "none",
  sm: "1px 0 0 #fff",
};
// #endregion

// #region Cell Styles

// #region Cell Background
type Rectangle = {
  height: number;
  width: number;
  xCoordinate: number;
  yCoordinate: number;
};

const getMarkupColorsBackground = (
  cellMarkupColors: Array<MarkupColor> | [""],
): ButtonProps["background"] => {
  const appliedMarkupColors = cellMarkupColors.filter(
    (markupColor) => markupColor !== "",
  );

  if (appliedMarkupColors.length === 0) return "transparent";

  const sortedMarkupColors = markupColors.filter((markupColor) =>
    appliedMarkupColors.includes(markupColor),
  );

  const degreesPerSlice = 360 / sortedMarkupColors.length;
  const gradientSegments = sortedMarkupColors.map(
    (color, index) =>
      `${color} ${index * degreesPerSlice}deg ${(index + 1) * degreesPerSlice}deg`,
  );

  const markupColorsBackground = `conic-gradient(${gradientSegments.join(", ")})`;

  return markupColorsBackground;
};

// #region Conflict Cell Background
const getConflictCellBackground = (
  hasDigitConflict: boolean,
): string | null => {
  if (!hasDigitConflict) return null;

  const conflictCellSvgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="${CONFLICT_CELL_COLOR}"
        opacity="${CONFLICT_CELL_OPACITY}"
      />
    </svg>
  `.trim();

  const conflictCellBackground = `url("data:image/svg+xml,${encodeURIComponent(conflictCellSvgMarkup)}")`;

  return conflictCellBackground;
};
// #endregion

// #region Show Seen Cell Background
type BoxAndPuzzleEdges = {
  isOnBottomBoxEdge: boolean;
  isOnBottomPuzzleEdge: boolean;
  isOnLeftBoxEdge: boolean;
  isOnLeftPuzzleEdge: boolean;
  isOnRightBoxEdge: boolean;
  isOnRightPuzzleEdge: boolean;
  isOnTopBoxEdge: boolean;
  isOnTopPuzzleEdge: boolean;
};

const getBoxAndPuzzleEdges = (
  columnNumber: number,
  rowNumber: number,
): BoxAndPuzzleEdges => ({
  isOnBottomBoxEdge: rowNumber % 3 === 0,
  isOnBottomPuzzleEdge: rowNumber === 9,
  isOnLeftBoxEdge: columnNumber % 3 === 1,
  isOnLeftPuzzleEdge: columnNumber === 1,
  isOnRightBoxEdge: columnNumber % 3 === 0,
  isOnRightPuzzleEdge: columnNumber === 9,
  isOnTopBoxEdge: rowNumber % 3 === 1,
  isOnTopPuzzleEdge: rowNumber === 1,
});

type IsCellInsideSelectedBoxArgs = {
  columnNumber: number;
  rowNumber: number;
  selectedColumnNumber: number;
  selectedRowNumber: number;
};

const isCellInsideSelectedBox = ({
  columnNumber,
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
}: IsCellInsideSelectedBoxArgs): boolean => {
  const selectedBoxColumnStart =
    Math.floor((selectedColumnNumber - 1) / 3) * 3 + 1;
  const selectedBoxRowStart = Math.floor((selectedRowNumber - 1) / 3) * 3 + 1;

  const isCellInsideSelectedBox =
    columnNumber >= selectedBoxColumnStart &&
    columnNumber <= selectedBoxColumnStart + 2 &&
    rowNumber >= selectedBoxRowStart &&
    rowNumber <= selectedBoxRowStart + 2;

  return isCellInsideSelectedBox;
};

const getSeenInBoxBackgroundRectangle = ({
  isOnBottomBoxEdge,
  isOnLeftBoxEdge,
  isOnRightBoxEdge,
  isOnTopBoxEdge,
}: Pick<
  BoxAndPuzzleEdges,
  | "isOnBottomBoxEdge"
  | "isOnLeftBoxEdge"
  | "isOnRightBoxEdge"
  | "isOnTopBoxEdge"
>): Rectangle => {
  const bottomInset = isOnBottomBoxEdge
    ? SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS
    : 0;
  const rightInset = isOnRightBoxEdge
    ? SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS
    : 0;
  const xCoordinate = isOnLeftBoxEdge
    ? SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS
    : 0;
  const yCoordinate = isOnTopBoxEdge
    ? SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS
    : 0;

  const seenInBoxBackgroundRectangle: Rectangle = {
    height: 100 - yCoordinate - bottomInset,
    width: 100 - xCoordinate - rightInset,
    xCoordinate,
    yCoordinate,
  };

  return seenInBoxBackgroundRectangle;
};

const getSeenInColumnBackgroundRectangle = (): Rectangle => ({
  height: 100,
  width: 100 - SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS * 2,
  xCoordinate: SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
  yCoordinate: 0,
});

const getSeenInRowBackgroundRectangle = (): Rectangle => ({
  height: 100 - SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS * 2,
  width: 100,
  xCoordinate: 0,
  yCoordinate: SEEN_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
});

const isRectangleVisible = (rectangle: Rectangle): boolean =>
  rectangle.height > 0 && rectangle.width > 0;

type GetSeenCellBackgroundRectanglesArgs = {
  columnNumber: number;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
  rowNumber: number;
  selectedColumnNumber: number;
  selectedRowNumber: number;
};

const getSeenCellBackgroundRectangles = ({
  columnNumber,
  isSeenInBox,
  isSeenInColumn,
  isSeenInRow,
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
}: GetSeenCellBackgroundRectanglesArgs): Array<Rectangle> => {
  if (!(isSeenInBox || isSeenInColumn || isSeenInRow)) return [];

  if (isSeenInBox && isSeenInColumn && isSeenInRow)
    return [{ height: 100, width: 100, xCoordinate: 0, yCoordinate: 0 }];

  const boxAndPuzzleEdges = getBoxAndPuzzleEdges(columnNumber, rowNumber);

  const isCellInSelectedBox = isCellInsideSelectedBox({
    columnNumber,
    rowNumber,
    selectedColumnNumber,
    selectedRowNumber,
  });

  const shouldSuppressColumnBandAtPuzzleEdge =
    isCellInSelectedBox &&
    (boxAndPuzzleEdges.isOnTopPuzzleEdge ||
      boxAndPuzzleEdges.isOnBottomPuzzleEdge);

  const shouldSuppressRowBandAtPuzzleEdge =
    isCellInSelectedBox &&
    (boxAndPuzzleEdges.isOnLeftPuzzleEdge ||
      boxAndPuzzleEdges.isOnRightPuzzleEdge);

  const backgroundRectangles: Array<Rectangle> = [];

  if (isSeenInBox)
    backgroundRectangles.push(
      getSeenInBoxBackgroundRectangle(boxAndPuzzleEdges),
    );

  if (isSeenInColumn && !shouldSuppressColumnBandAtPuzzleEdge)
    backgroundRectangles.push(getSeenInColumnBackgroundRectangle());

  if (isSeenInRow && !shouldSuppressRowBandAtPuzzleEdge)
    backgroundRectangles.push(getSeenInRowBackgroundRectangle());

  const seenCellBackgroundRectangles =
    backgroundRectangles.filter(isRectangleVisible);

  return seenCellBackgroundRectangles;
};

type GetSeenCellBackgroundArgs = {
  columnNumber: number;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
  rowNumber: number;
  selectedColumnNumber: number;
  selectedRowNumber: number;
  showSeenCells: boolean;
};

const getSeenCellBackground = ({
  columnNumber,
  isSeenInBox,
  isSeenInColumn,
  isSeenInRow,
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
  showSeenCells,
}: GetSeenCellBackgroundArgs): string | null => {
  if (!showSeenCells) return null;

  const seenCellBackgroundRectangles = getSeenCellBackgroundRectangles({
    columnNumber,
    isSeenInBox,
    isSeenInColumn,
    isSeenInRow,
    rowNumber,
    selectedColumnNumber,
    selectedRowNumber,
  });

  if (seenCellBackgroundRectangles.length === 0) return null;

  const seenCellRectanglesAsSvgMarkup = seenCellBackgroundRectangles
    .map(
      ({ xCoordinate, yCoordinate, width, height }) =>
        `<rect x="${xCoordinate}" y="${yCoordinate}" width="${width}" height="${height}" fill="${SEEN_CELL_COLOR}" />`,
    )
    .join("");

  const seenCellSvgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g opacity="${SEEN_CELL_OPACITY}">
        ${seenCellRectanglesAsSvgMarkup}
      </g>
    </svg>
  `.trim();

  const seenCellBackground = `url("data:image/svg+xml,${encodeURIComponent(seenCellSvgMarkup)}")`;

  return seenCellBackground;
};
// #endregion

// #region Selected Cell Background
type SelectedAdjacentCells = {
  isSelectedCellAbove: boolean;
  isSelectedCellAboveLeft: boolean;
  isSelectedCellAboveRight: boolean;
  isSelectedCellBelow: boolean;
  isSelectedCellBelowLeft: boolean;
  isSelectedCellBelowRight: boolean;
  isSelectedCellToLeft: boolean;
  isSelectedCellToRight: boolean;
};

const getCellStateAtRowAndColumn = (
  boardState: BoardState,
  rowNumber: number,
  columnNumber: number,
): CellState | undefined => {
  if (rowNumber < 1 || rowNumber > 9 || columnNumber < 1 || columnNumber > 9)
    return undefined;

  return boardState[(rowNumber - 1) * 9 + (columnNumber - 1)];
};

const getSelectedAdjacentCells = (
  boardState: BoardState,
  cellState: CellState,
): SelectedAdjacentCells => {
  const { rowNumber, columnNumber } = cellState;

  const isSelectedCellAbove = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber - 1,
    columnNumber,
  )?.isSelected;
  const isSelectedCellAboveLeft = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber - 1,
    columnNumber - 1,
  )?.isSelected;
  const isSelectedCellAboveRight = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber - 1,
    columnNumber + 1,
  )?.isSelected;
  const isSelectedCellBelow = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber + 1,
    columnNumber,
  )?.isSelected;
  const isSelectedCellBelowLeft = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber + 1,
    columnNumber - 1,
  )?.isSelected;
  const isSelectedCellBelowRight = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber + 1,
    columnNumber + 1,
  )?.isSelected;
  const isSelectedCellToLeft = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber,
    columnNumber - 1,
  )?.isSelected;
  const isSelectedCellToRight = !!getCellStateAtRowAndColumn(
    boardState,
    rowNumber,
    columnNumber + 1,
  )?.isSelected;

  const selectedAdjacentCells = {
    isSelectedCellAbove,
    isSelectedCellAboveLeft,
    isSelectedCellAboveRight,
    isSelectedCellBelow,
    isSelectedCellBelowLeft,
    isSelectedCellBelowRight,
    isSelectedCellToLeft,
    isSelectedCellToRight,
  };

  return selectedAdjacentCells;
};

type GetSelectedCellBackgroundArgs = {
  isSelected: boolean;
  isSelectedCellAbove: boolean;
  isSelectedCellAboveLeft: boolean;
  isSelectedCellAboveRight: boolean;
  isSelectedCellBelow: boolean;
  isSelectedCellBelowLeft: boolean;
  isSelectedCellBelowRight: boolean;
  isSelectedCellToLeft: boolean;
  isSelectedCellToRight: boolean;
};

const getSelectedCellBackground = ({
  isSelected,
  isSelectedCellAbove,
  isSelectedCellAboveLeft,
  isSelectedCellAboveRight,
  isSelectedCellBelow,
  isSelectedCellBelowLeft,
  isSelectedCellBelowRight,
  isSelectedCellToLeft,
  isSelectedCellToRight,
}: GetSelectedCellBackgroundArgs): string | null => {
  if (!isSelected) return null;

  const selectedCellRectangles: Array<Rectangle> = [];

  if (!isSelectedCellAbove)
    selectedCellRectangles.push({
      height: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      width: 100,
      xCoordinate: 0,
      yCoordinate: 0,
    });

  if (!isSelectedCellBelow)
    selectedCellRectangles.push({
      height: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      width: 100,
      xCoordinate: 0,
      yCoordinate: 100 - SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
    });

  if (!isSelectedCellToLeft)
    selectedCellRectangles.push({
      height: 100,
      width: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      xCoordinate: 0,
      yCoordinate: 0,
    });

  if (!isSelectedCellToRight)
    selectedCellRectangles.push({
      height: 100,
      width: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      xCoordinate: 100 - SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      yCoordinate: 0,
    });

  if (isSelectedCellAbove && isSelectedCellToLeft && !isSelectedCellAboveLeft)
    selectedCellRectangles.push({
      height: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      width: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      xCoordinate: 0,
      yCoordinate: 0,
    });

  if (isSelectedCellAbove && isSelectedCellToRight && !isSelectedCellAboveRight)
    selectedCellRectangles.push({
      height: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      width: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      xCoordinate: 100 - SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      yCoordinate: 0,
    });

  if (isSelectedCellBelow && isSelectedCellToLeft && !isSelectedCellBelowLeft)
    selectedCellRectangles.push({
      height: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      width: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      xCoordinate: 0,
      yCoordinate: 100 - SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
    });

  if (isSelectedCellBelow && isSelectedCellToRight && !isSelectedCellBelowRight)
    selectedCellRectangles.push({
      height: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      width: SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      xCoordinate: 100 - SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
      yCoordinate: 100 - SELECTED_CELL_EDGE_THICKNESS_IN_VIEWBOX_UNITS,
    });

  if (selectedCellRectangles.length === 0) return null;

  const selectedCellRectanglesAsSvgMarkup = selectedCellRectangles
    .map(
      ({ xCoordinate, yCoordinate, width, height }) =>
        `<rect x="${xCoordinate}" y="${yCoordinate}" width="${width}" height="${height}" fill="${SELECTED_CELL_COLOR}" />`,
    )
    .join("");

  const selectedCellSvgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      ${selectedCellRectanglesAsSvgMarkup}
    </svg>
  `.trim();

  const selectedCellBackground = `url("data:image/svg+xml,${encodeURIComponent(selectedCellSvgMarkup)}")`;

  return selectedCellBackground;
};
// #endregion

type GetCellBackgroundArgs = {
  cellMarkupColors: Array<MarkupColor> | [""];
  columnNumber: number;
  hasDigitConflict: boolean;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
  isSelected: boolean;
  isSelectedCellAbove: boolean;
  isSelectedCellAboveLeft: boolean;
  isSelectedCellAboveRight: boolean;
  isSelectedCellBelow: boolean;
  isSelectedCellBelowLeft: boolean;
  isSelectedCellBelowRight: boolean;
  isSelectedCellToLeft: boolean;
  isSelectedCellToRight: boolean;
  rowNumber: number;
  selectedColumnNumber: number;
  selectedRowNumber: number;
  showSeenCells: boolean;
};

const getCellBackground = ({
  cellMarkupColors,
  columnNumber,
  hasDigitConflict,
  isSeenInBox,
  isSeenInColumn,
  isSeenInRow,
  isSelected,
  isSelectedCellAbove,
  isSelectedCellAboveLeft,
  isSelectedCellAboveRight,
  isSelectedCellBelow,
  isSelectedCellBelowLeft,
  isSelectedCellBelowRight,
  isSelectedCellToLeft,
  isSelectedCellToRight,
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
  showSeenCells,
}: GetCellBackgroundArgs): ButtonProps["background"] => {
  const backgroundLayers = [
    getSelectedCellBackground({
      isSelected,
      isSelectedCellAbove,
      isSelectedCellAboveLeft,
      isSelectedCellAboveRight,
      isSelectedCellBelow,
      isSelectedCellBelowLeft,
      isSelectedCellBelowRight,
      isSelectedCellToLeft,
      isSelectedCellToRight,
    }),
    getConflictCellBackground(hasDigitConflict),
    getSeenCellBackground({
      columnNumber,
      isSeenInBox,
      isSeenInColumn,
      isSeenInRow,
      rowNumber,
      selectedColumnNumber,
      selectedRowNumber,
      showSeenCells,
    }),
    getMarkupColorsBackground(cellMarkupColors),
  ].filter(Boolean);

  const cellBackground = backgroundLayers.join(", ");

  return cellBackground;
};
// #endregion

// #region Other Cell Styles
const getFontSize = (cellContent: CellContent): ButtonProps["fontSize"] => {
  if (isStartingOrPlayerDigitInCellContent(cellContent)) {
    return DIGIT_FONT_SIZE;
  } else if (isMarkupDigitsInCellContent(cellContent)) {
    const centerMarkupsCount = cellContent.centerMarkups.length;

    switch (centerMarkupsCount) {
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
  dashedGridEnabled: boolean,
  rowNumber: number,
) => {
  const isOnBottomBoxEdge = rowNumber % 3 === 0;
  const isOnLeftBoxEdge = columnNumber % 3 === 1;
  const isOnRightBoxEdge = columnNumber % 3 === 0;
  const isOnTopBoxEdge = rowNumber % 3 === 1;

  const cellBorderStyles = {
    borderBottomStyle:
      !isOnBottomBoxEdge && dashedGridEnabled ? "dashed" : "solid",
    borderLeftStyle: !isOnLeftBoxEdge && dashedGridEnabled ? "dashed" : "solid",
    borderRightStyle:
      !isOnRightBoxEdge && dashedGridEnabled ? "dashed" : "solid",
    borderTopStyle: !isOnTopBoxEdge && dashedGridEnabled ? "dashed" : "solid",
  };

  return cellBorderStyles;
};

const getCellBorderWidths = (columnNumber: number, rowNumber: number) => {
  const isOnLeftBoxEdge = columnNumber % 3 === 1;
  const isOnTopBoxEdge = rowNumber % 3 === 1;

  const cellBorderWidths = {
    borderBottomWidth: "2px",
    borderLeftWidth: isOnLeftBoxEdge ? "2px" : "0",
    borderRightWidth: "2px",
    borderTopWidth: isOnTopBoxEdge ? "2px" : "0",
  };

  return cellBorderWidths;
};
// #endregion

// #endregion

// #region Cell Floats

// #region Corner Markup Floats
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

const floatPlacementIndexesByMarkupCount: Record<
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
  cornerMarkupCount: number,
  cornerMarkupIndex: number,
): FloatPlacement => {
  const placementIndexes =
    floatPlacementIndexesByMarkupCount[cornerMarkupCount] ??
    floatPlacementIndexesByMarkupCount[9];

  return floatPlacements[placementIndexes[cornerMarkupIndex]];
};

const getCornerMarkups = (cellContent: CellContent): Array<string> => {
  if (
    isMarkupDigitsInCellContent(cellContent) &&
    cellContent.cornerMarkups[0] !== ""
  )
    return [...cellContent.cornerMarkups].sort();

  return [""];
};

const getCornerMarkupFloats = (
  cellContent: CellContent,
): Array<ReactNode> | undefined => {
  const cornerMarkups = getCornerMarkups(cellContent);

  if (cornerMarkups.length === 0 || cornerMarkups[0] === "") return undefined;

  const cornerMarkupFloats = cornerMarkups.reduce<Array<ReactNode>>(
    (cornerMarkupFloatNodes, cornerMarkup, markupIndex) => {
      const placement = getFloatPlacement(cornerMarkups.length, markupIndex);

      cornerMarkupFloatNodes.push(
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

      return cornerMarkupFloatNodes;
    },
    [],
  );

  return cornerMarkupFloats;
};
// #endregion

// #region Row and Column Label Floats
const getRowLabelFloat = (rowNumber: number): ReactNode => {
  return (
    <Float
      color="black"
      fontSize={CORNER_AND_LABEL_FONT_SIZE}
      key={`row-label-${rowNumber}`}
      offsetX={{ base: "-8px", md: "-15px" }}
      placement="middle-start"
    >
      {rowNumber.toString()}
    </Float>
  );
};

const getColumnLabelFloat = (columnNumber: number): ReactNode => {
  return (
    <Float
      color="black"
      fontSize={CORNER_AND_LABEL_FONT_SIZE}
      key={`column-label-${columnNumber}`}
      offsetY={{ base: "-8px", sm: "-12px", md: "-15px" }}
      placement="top-center"
    >
      {columnNumber.toString()}
    </Float>
  );
};
// #endregion

// #endregion

// #region Handle Double Click
const isEmptyEditableCellWithoutMarkup = (cellState: CellState) => {
  const { cellContent } = cellState;

  if (isStartingDigitInCellContent(cellContent)) return false;

  if (isPlayerDigitInCellContent(cellContent) && cellContent.playerDigit !== "")
    return false;

  if (
    isMarkupDigitsInCellContent(cellContent) &&
    cellContent.cornerMarkups[0] !== ""
  )
    return false;

  if (
    isMarkupDigitsInCellContent(cellContent) &&
    cellContent.centerMarkups[0] !== ""
  )
    return false;

  if (cellState.markupColors[0] !== "") return false;

  return true;
};

const getCellStateAsSelectedIfMatchingMarkupColorsExist = (
  sourceMarkupColors: [""] | Array<MarkupColor>,
  candidateMarkupColors: [""] | Array<MarkupColor>,
  candidateCellState: CellState,
): CellState => {
  const hasAtLeastOneMatchingMarkupColor =
    isArrayOfMarkupColors(sourceMarkupColors) &&
    isArrayOfMarkupColors(candidateMarkupColors) &&
    sourceMarkupColors.some((markupColor) =>
      candidateMarkupColors.includes(markupColor),
    );

  if (hasAtLeastOneMatchingMarkupColor) {
    const nextCellState = {
      ...candidateCellState,
      isSelected: true,
    };

    return nextCellState;
  }

  return candidateCellState;
};

const doBothCellsContainAtLeastOneMatchingMarkupDigit = (
  sourceMarkupDigits: MarkupDigits,
  candidateMarkupDigits: MarkupDigits,
): boolean =>
  isArrayOfSudokuDigits(sourceMarkupDigits) &&
  isArrayOfSudokuDigits(candidateMarkupDigits) &&
  sourceMarkupDigits.some((markupDigit) =>
    candidateMarkupDigits.includes(markupDigit),
  );

const getCellStateAsSelectedIfMatchingMarkupDigitsExist = (
  sourceCellContent: MarkupDigitsCellContent,
  candidateCellContent: MarkupDigitsCellContent,
  candidateCellState: CellState,
): CellState => {
  const hasAtLeastOneMatchingMarkupDigit =
    doBothCellsContainAtLeastOneMatchingMarkupDigit(
      sourceCellContent.centerMarkups,
      candidateCellContent.centerMarkups,
    ) ||
    doBothCellsContainAtLeastOneMatchingMarkupDigit(
      sourceCellContent.cornerMarkups,
      candidateCellContent.cornerMarkups,
    );

  if (hasAtLeastOneMatchingMarkupDigit) {
    const nextCellState = {
      ...candidateCellState,
      isSelected: true,
    };

    return nextCellState;
  }

  return candidateCellState;
};

const doMarkupColorsMatchExactly = (
  sourceMarkupColors: [""] | Array<MarkupColor>,
  candidateMarkupColors: [""] | Array<MarkupColor>,
): boolean => {
  if (!isArrayOfMarkupColors(sourceMarkupColors))
    return !isArrayOfMarkupColors(candidateMarkupColors);

  if (!isArrayOfMarkupColors(candidateMarkupColors)) return false;

  const sourceMarkupColorsSortedInDisplayOrder = markupColors.filter(
    (markupColor) => sourceMarkupColors.includes(markupColor),
  );

  const candidateMarkupColorsSortedInDisplayOrder = markupColors.filter(
    (markupColor) => candidateMarkupColors.includes(markupColor),
  );

  const doMarkupColorsHaveSameLength =
    sourceMarkupColorsSortedInDisplayOrder.length ===
    candidateMarkupColorsSortedInDisplayOrder.length;

  if (!doMarkupColorsHaveSameLength) return false;

  const doAllMarkupColorsMatchByPosition =
    sourceMarkupColorsSortedInDisplayOrder.every(
      (markupColor, markupColorIndex) =>
        markupColor ===
        candidateMarkupColorsSortedInDisplayOrder[markupColorIndex],
    );

  return doAllMarkupColorsMatchByPosition;
};

const doMarkupDigitsMatchExactly = (
  sourceMarkupDigits: MarkupDigits,
  candidateMarkupDigits: MarkupDigits,
): boolean => {
  if (!isArrayOfSudokuDigits(sourceMarkupDigits))
    return !isArrayOfSudokuDigits(candidateMarkupDigits);

  if (!isArrayOfSudokuDigits(candidateMarkupDigits)) return false;

  const sourceMarkupDigitsSorted = [...sourceMarkupDigits].sort();
  const candidateMarkupDigitsSorted = [...candidateMarkupDigits].sort();

  const doMarkupDigitsHaveSameLength =
    sourceMarkupDigitsSorted.length === candidateMarkupDigitsSorted.length;

  if (!doMarkupDigitsHaveSameLength) return false;

  const doAllMarkupDigitsMatchByPosition = sourceMarkupDigitsSorted.every(
    (markupDigit, markupDigitIndex) =>
      markupDigit === candidateMarkupDigitsSorted[markupDigitIndex],
  );

  return doAllMarkupDigitsMatchByPosition;
};

const doesMarkupDigitsCellContentMatchExactly = (
  sourceCellContent: MarkupDigitsCellContent,
  candidateCellContent: MarkupDigitsCellContent,
): boolean => {
  const doesCenterMarkupsMatchExactly = doMarkupDigitsMatchExactly(
    sourceCellContent.centerMarkups,
    candidateCellContent.centerMarkups,
  );

  const doesCornerMarkupsMatchExactly = doMarkupDigitsMatchExactly(
    sourceCellContent.cornerMarkups,
    candidateCellContent.cornerMarkups,
  );

  const doesSourceCellContainAtLeastOneMarkupDigit =
    isArrayOfSudokuDigits(sourceCellContent.centerMarkups) ||
    isArrayOfSudokuDigits(sourceCellContent.cornerMarkups);

  const doesCandidateCellContainAtLeastOneMarkupDigit =
    isArrayOfSudokuDigits(candidateCellContent.centerMarkups) ||
    isArrayOfSudokuDigits(candidateCellContent.cornerMarkups);

  const doesMarkupDigitsCellContentMatchExactly =
    doesCenterMarkupsMatchExactly &&
    doesCornerMarkupsMatchExactly &&
    doesSourceCellContainAtLeastOneMarkupDigit &&
    doesCandidateCellContainAtLeastOneMarkupDigit;

  return doesMarkupDigitsCellContentMatchExactly;
};

const doesCellContentContainStartingOrPlayerDigit = (
  cellContent: CellContent,
): boolean =>
  isStartingOrPlayerDigitInCellContent(cellContent) &&
  getStartingOrPlayerDigitInCellIfPresent(cellContent) !== "";

const doesCellContentContainMarkupDigits = (
  cellContent: CellContent,
): boolean =>
  isMarkupDigitsInCellContent(cellContent) &&
  (isArrayOfSudokuDigits(cellContent.centerMarkups) ||
    isArrayOfSudokuDigits(cellContent.cornerMarkups));

const doCellsContainOnlyMarkupColors = (
  sourceCellContent: CellContent,
  candidateCellContent: CellContent,
): boolean => {
  const doesSourceCellContainStartingOrPlayerDigit =
    doesCellContentContainStartingOrPlayerDigit(sourceCellContent);

  const doesCandidateCellContainStartingOrPlayerDigit =
    doesCellContentContainStartingOrPlayerDigit(candidateCellContent);

  const doesSourceCellContainMarkupDigits =
    doesCellContentContainMarkupDigits(sourceCellContent);

  const doesCandidateCellContainMarkupDigits =
    doesCellContentContainMarkupDigits(candidateCellContent);

  const doCellsContainOnlyMarkupColors = !(
    doesSourceCellContainStartingOrPlayerDigit ||
    doesCandidateCellContainStartingOrPlayerDigit ||
    doesSourceCellContainMarkupDigits ||
    doesCandidateCellContainMarkupDigits
  );

  return doCellsContainOnlyMarkupColors;
};

const getSelectedCellStateWithStrictMatching = (
  sourceCellState: CellState,
  candidateCellState: CellState,
): CellState => {
  if (isEmptyEditableCellWithoutMarkup(candidateCellState))
    return candidateCellState;

  const doCellMarkupColorsMatchExactly = doMarkupColorsMatchExactly(
    sourceCellState.markupColors,
    candidateCellState.markupColors,
  );

  if (!doCellMarkupColorsMatchExactly) return candidateCellState;

  const sourceCellContent = sourceCellState.cellContent;
  const candidateCellContent = candidateCellState.cellContent;

  const sourceStartingOrPlayerDigit =
    getStartingOrPlayerDigitInCellIfPresent(sourceCellContent);

  const candidateStartingOrPlayerDigit =
    getStartingOrPlayerDigitInCellIfPresent(candidateCellContent);

  const doStartingOrPlayerDigitsMatchExactly =
    isStartingOrPlayerDigitInCellContent(sourceCellContent) &&
    isStartingOrPlayerDigitInCellContent(candidateCellContent) &&
    sourceStartingOrPlayerDigit === candidateStartingOrPlayerDigit &&
    sourceStartingOrPlayerDigit !== "" &&
    candidateStartingOrPlayerDigit !== "";

  const doMarkupDigitsMatchExactlyBetweenCells =
    isMarkupDigitsInCellContent(sourceCellContent) &&
    isMarkupDigitsInCellContent(candidateCellContent) &&
    doesMarkupDigitsCellContentMatchExactly(
      sourceCellContent,
      candidateCellContent,
    );

  const doCellsContainOnlyMarkupColorsAndMatchExactly =
    doCellsContainOnlyMarkupColors(sourceCellContent, candidateCellContent);

  if (
    doStartingOrPlayerDigitsMatchExactly ||
    doMarkupDigitsMatchExactlyBetweenCells ||
    doCellsContainOnlyMarkupColorsAndMatchExactly
  ) {
    const nextCellState = {
      ...candidateCellState,
      isSelected: true,
    };

    return nextCellState;
  }

  return candidateCellState;
};

const getSelectedCellStateWithPartialMatching = (
  sourceCellState: CellState,
  candidateCellState: CellState,
): CellState => {
  if (isEmptyEditableCellWithoutMarkup(candidateCellState))
    return candidateCellState;

  const sourceCellContent = sourceCellState.cellContent;
  const candidateCellContent = candidateCellState.cellContent;

  if (
    sourceCellState.markupColors[0] !== "" &&
    candidateCellState.markupColors[0] !== ""
  )
    return getCellStateAsSelectedIfMatchingMarkupColorsExist(
      sourceCellState.markupColors,
      candidateCellState.markupColors,
      candidateCellState,
    );

  if (
    isMarkupDigitsInCellContent(sourceCellContent) &&
    isMarkupDigitsInCellContent(candidateCellContent)
  )
    return getCellStateAsSelectedIfMatchingMarkupDigitsExist(
      sourceCellContent,
      candidateCellContent,
      candidateCellState,
    );

  const sourceStartingOrPlayerDigit =
    getStartingOrPlayerDigitInCellIfPresent(sourceCellContent);

  const candidateStartingOrPlayerDigit =
    getStartingOrPlayerDigitInCellIfPresent(candidateCellContent);

  if (
    isStartingOrPlayerDigitInCellContent(sourceCellContent) &&
    isStartingOrPlayerDigitInCellContent(candidateCellContent) &&
    sourceStartingOrPlayerDigit === candidateStartingOrPlayerDigit &&
    sourceStartingOrPlayerDigit !== "" &&
    candidateStartingOrPlayerDigit !== ""
  ) {
    const nextCellState = {
      ...candidateCellState,
      isSelected: true,
    };

    return nextCellState;
  }

  return candidateCellState;
};

const handleCellDoubleClick = (
  sourceCellState: CellState,
  strictHighlights: boolean,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const currentBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const boardStateWithNoCellsSelected: BoardState = currentBoardState.map(
      (cellState) => ({
        ...cellState,
        isSelected: false,
      }),
    );

    const boardStateWithMatchingCellsSelected: BoardState = strictHighlights
      ? boardStateWithNoCellsSelected.map((cellState) =>
          getSelectedCellStateWithStrictMatching(sourceCellState, cellState),
        )
      : boardStateWithNoCellsSelected.map((cellState) =>
          getSelectedCellStateWithPartialMatching(sourceCellState, cellState),
        );

    const nextBoardStateHistory = [...previousPuzzleHistory.boardStateHistory];
    nextBoardStateHistory[previousPuzzleHistory.currentBoardStateIndex] =
      boardStateWithMatchingCellsSelected;

    const nextPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
  });
};
// #endregion

const getNonCornerCellDigits = (cellContent: CellContent): string => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else if (isMarkupDigitsInCellContent(cellContent))
    return [...cellContent.centerMarkups].sort().join("");

  return "";
};

type CellProps = {
  boardState: BoardState;
  cellState: CellState;
  hasDigitConflict: boolean;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
  selectedColumnNumber: number;
  selectedRowNumber: number;
  handleCellPointerDown: (cellNumber: number) => void;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const Cell = memo(
  ({
    boardState,
    cellState,
    hasDigitConflict,
    isSeenInBox,
    isSeenInColumn,
    isSeenInRow,
    selectedColumnNumber,
    selectedRowNumber,
    handleCellPointerDown,
    setPuzzleHistory,
  }: CellProps) => {
    const { userSettings } = useUserSettings();
    const {
      dashedGrid,
      showRowAndColumnLabels,
      showSeenCells,
      strictHighlights,
    } = userSettings;

    const selectedAdjacentCells = getSelectedAdjacentCells(
      boardState,
      cellState,
    );

    const {
      cellContent,
      cellNumber,
      columnNumber,
      isSelected,
      markupColors: cellMarkupColors,
      rowNumber,
    } = cellState;
    const nonCornerCellDigits = getNonCornerCellDigits(cellContent);
    const cornerMarkupFloats = getCornerMarkupFloats(cellContent);

    return (
      <Button
        background={getCellBackground({
          cellMarkupColors,
          columnNumber,
          hasDigitConflict,
          isSeenInBox,
          isSeenInColumn,
          isSeenInRow,
          isSelected,
          rowNumber,
          selectedColumnNumber,
          selectedRowNumber,
          showSeenCells,
          ...selectedAdjacentCells,
        })}
        borderColor="black"
        borderRadius="0"
        color={isStartingDigitInCellContent(cellContent) ? "black" : "#1212f0"}
        data-cell-number={cellNumber}
        fontSize={getFontSize(cellContent)}
        height={CELL_SIZE}
        minWidth={CELL_SIZE}
        padding="0"
        textShadow={getTextShadow(cellContent)}
        transition="none"
        width={CELL_SIZE}
        {...getCellBorderStyles(columnNumber, dashedGrid, rowNumber)}
        {...getCellBorderWidths(columnNumber, rowNumber)}
        onDoubleClick={() =>
          handleCellDoubleClick(cellState, strictHighlights, setPuzzleHistory)
        }
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          handleCellPointerDown(cellNumber);
        }}
      >
        {showRowAndColumnLabels &&
          columnNumber === 1 &&
          getRowLabelFloat(rowNumber)}
        {showRowAndColumnLabels &&
          rowNumber === 1 &&
          getColumnLabelFloat(columnNumber)}
        {cornerMarkupFloats}
        {nonCornerCellDigits}
      </Button>
    );
  },
);
