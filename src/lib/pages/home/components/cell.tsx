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
import { useUserSettings } from "@/lib/utils/useUserSettings";

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

// #region Cell Content & Styling
const getNonCornerDigitsInCellAsString = (cellContent: CellContent): string => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else if (isMarkupDigitsInCellContent(cellContent))
    return [...cellContent.centerMarkups].sort().join("");

  return "";
};

// #region Conflict Overlay
const CONFLICT_CELLS_TINT_RGB = "rgb(179, 58, 58)";
const CONFLICT_CELLS_OPACITY = 0.65;

const getConflictOverlayBackground = (
  hasDigitConflict: boolean,
): string | null => {
  if (!hasDigitConflict) return null;

  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="${CONFLICT_CELLS_TINT_RGB}"
        opacity="${CONFLICT_CELLS_OPACITY}"
      />
    </svg>
  `.trim();

  return `url("data:image/svg+xml,${encodeURIComponent(svgMarkup)}")`;
};
// #endregion

// #region Show Seen Cells Overlay
const SEEN_CELLS_TINT_RGB = "rgb(255, 215, 0)";
const SEEN_CELLS_OPACITY = 0.25;
const SEEN_CELLS_STRIP = 8; // percentage-like units in a 100x100 SVG viewBox

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type BoxAndPuzzleEdges = {
  isOnLeftBoxEdge: boolean;
  isOnRightBoxEdge: boolean;
  isOnTopBoxEdge: boolean;
  isOnBottomBoxEdge: boolean;
  isOnLeftPuzzleEdge: boolean;
  isOnRightPuzzleEdge: boolean;
  isOnTopPuzzleEdge: boolean;
  isOnBottomPuzzleEdge: boolean;
};

const getBoxAndPuzzleEdges = (
  columnNumber: number,
  rowNumber: number,
): BoxAndPuzzleEdges => ({
  isOnLeftBoxEdge: columnNumber % 3 === 1,
  isOnRightBoxEdge: columnNumber % 3 === 0,
  isOnTopBoxEdge: rowNumber % 3 === 1,
  isOnBottomBoxEdge: rowNumber % 3 === 0,
  isOnLeftPuzzleEdge: columnNumber === 1,
  isOnRightPuzzleEdge: columnNumber === 9,
  isOnTopPuzzleEdge: rowNumber === 1,
  isOnBottomPuzzleEdge: rowNumber === 9,
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

  return (
    columnNumber >= selectedBoxColumnStart &&
    columnNumber <= selectedBoxColumnStart + 2 &&
    rowNumber >= selectedBoxRowStart &&
    rowNumber <= selectedBoxRowStart + 2
  );
};

const getSeenInBoxOverlayRect = ({
  isOnLeftBoxEdge,
  isOnRightBoxEdge,
  isOnTopBoxEdge,
  isOnBottomBoxEdge,
}: Pick<
  BoxAndPuzzleEdges,
  | "isOnLeftBoxEdge"
  | "isOnRightBoxEdge"
  | "isOnTopBoxEdge"
  | "isOnBottomBoxEdge"
>): Rect => {
  const x = isOnLeftBoxEdge ? SEEN_CELLS_STRIP : 0;
  const y = isOnTopBoxEdge ? SEEN_CELLS_STRIP : 0;
  const rightInset = isOnRightBoxEdge ? SEEN_CELLS_STRIP : 0;
  const bottomInset = isOnBottomBoxEdge ? SEEN_CELLS_STRIP : 0;

  const seenInBoxOverlayRect = {
    x,
    y,
    width: 100 - x - rightInset,
    height: 100 - y - bottomInset,
  };

  return seenInBoxOverlayRect;
};

const getSeenInColumnOverlayRect = (): Rect => ({
  x: SEEN_CELLS_STRIP,
  y: 0,
  width: 100 - SEEN_CELLS_STRIP * 2,
  height: 100,
});

const getSeenInRowOverlayRect = (): Rect => ({
  x: 0,
  y: SEEN_CELLS_STRIP,
  width: 100,
  height: 100 - SEEN_CELLS_STRIP * 2,
});

const isRectVisible = (rect: Rect): boolean =>
  rect.width > 0 && rect.height > 0;

type GetSeenCellsOverlayRectsArgs = {
  columnNumber: number;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
  rowNumber: number;
  selectedColumnNumber: number;
  selectedRowNumber: number;
};

const getSeenCellsOverlayRects = ({
  columnNumber,
  isSeenInBox,
  isSeenInColumn,
  isSeenInRow,
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
}: GetSeenCellsOverlayRectsArgs): Array<Rect> => {
  if (!(isSeenInBox || isSeenInColumn || isSeenInRow)) return [];

  if (isSeenInBox && isSeenInColumn && isSeenInRow)
    return [{ x: 0, y: 0, width: 100, height: 100 }];

  const boxAndPuzzleEdges = getBoxAndPuzzleEdges(columnNumber, rowNumber);

  const isInsideSelectedBox = isCellInsideSelectedBox({
    columnNumber,
    rowNumber,
    selectedColumnNumber,
    selectedRowNumber,
  });

  const shouldSuppressRowBandAtPuzzleEdge =
    isInsideSelectedBox &&
    (boxAndPuzzleEdges.isOnLeftPuzzleEdge ||
      boxAndPuzzleEdges.isOnRightPuzzleEdge);

  const shouldSuppressColumnBandAtPuzzleEdge =
    isInsideSelectedBox &&
    (boxAndPuzzleEdges.isOnTopPuzzleEdge ||
      boxAndPuzzleEdges.isOnBottomPuzzleEdge);

  const overlayRects: Array<Rect> = [];

  if (isSeenInBox)
    overlayRects.push(getSeenInBoxOverlayRect(boxAndPuzzleEdges));

  if (isSeenInRow && !shouldSuppressRowBandAtPuzzleEdge)
    overlayRects.push(getSeenInRowOverlayRect());

  if (isSeenInColumn && !shouldSuppressColumnBandAtPuzzleEdge)
    overlayRects.push(getSeenInColumnOverlayRect());

  const seenCellsOverlayRects = overlayRects.filter(isRectVisible);

  return seenCellsOverlayRects;
};

type GetSeenCellsOverlayBackgroundArgs = {
  columnNumber: number;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
  rowNumber: number;
  selectedColumnNumber: number;
  selectedRowNumber: number;
  showSeenCells: boolean;
};

const getSeenCellsOverlayBackground = ({
  columnNumber,
  isSeenInBox,
  isSeenInColumn,
  isSeenInRow,
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
  showSeenCells,
}: GetSeenCellsOverlayBackgroundArgs): string | null => {
  if (!showSeenCells) return null;

  const seenCellsOverlayRects = getSeenCellsOverlayRects({
    columnNumber,
    isSeenInBox,
    isSeenInColumn,
    isSeenInRow,
    rowNumber,
    selectedColumnNumber,
    selectedRowNumber,
  });

  if (seenCellsOverlayRects.length === 0) return null;

  const rectSvgMarkup = seenCellsOverlayRects
    .map(
      ({ x, y, width, height }) =>
        `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${SEEN_CELLS_TINT_RGB}" />`,
    )
    .join("");

  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <g opacity="${SEEN_CELLS_OPACITY}">
        ${rectSvgMarkup}
      </g>
    </svg>
  `.trim();

  const seenCellsOverlayBackground = `url("data:image/svg+xml,${encodeURIComponent(svgMarkup)}")`;

  return seenCellsOverlayBackground;
};
// #endregion

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

  const markupColorsAsBackgroundCss = `conic-gradient(${gradientSegments.join(", ")})`;

  return markupColorsAsBackgroundCss;
};

type GetCellBackgroundArgs = {
  cellMarkupColors: Array<MarkupColor> | [""];
  columnNumber: number;
  hasDigitConflict: boolean;
  isSeenInBox: boolean;
  isSeenInColumn: boolean;
  isSeenInRow: boolean;
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
  rowNumber,
  selectedColumnNumber,
  selectedRowNumber,
  showSeenCells,
}: GetCellBackgroundArgs): ButtonProps["background"] => {
  const backgroundLayers = [
    getConflictOverlayBackground(hasDigitConflict),
    getSeenCellsOverlayBackground({
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

// #region Float Handling
const getCornerMarkups = (cellContent: CellContent): Array<string> => {
  if (
    isMarkupDigitsInCellContent(cellContent) &&
    cellContent.cornerMarkups[0] !== ""
  ) {
    return [...cellContent.cornerMarkups].sort();
  }

  return [""];
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

const getCornerMarkupFloats = (
  cornerMarkups: Array<string>,
): Array<ReactNode> | undefined => {
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

const isArrayOfMarkupColors = (
  values: [""] | Array<MarkupColor>,
): values is Array<MarkupColor> => values[0] !== "";

const getCellStateWithSelectionIfMatchingMarkupColorsExist = (
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

const isArrayOfSudokuDigits = (
  values: MarkupDigits,
): values is Array<SudokuDigit> => values[0] !== "";

const doBothCellsContainAtLeastOneMatchingMarkupDigit = (
  sourceMarkupDigits: MarkupDigits,
  candidateMarkupDigits: MarkupDigits,
): boolean =>
  isArrayOfSudokuDigits(sourceMarkupDigits) &&
  isArrayOfSudokuDigits(candidateMarkupDigits) &&
  sourceMarkupDigits.some((markupDigit) =>
    candidateMarkupDigits.includes(markupDigit),
  );

const getCellStateWithSelectionIfMatchingMarkupDigitsExist = (
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

const isArrayOfMarkupDigits = (
  values: MarkupDigits,
): values is Array<SudokuDigit> => values[0] !== "";

const doMarkupDigitsMatchExactly = (
  sourceMarkupDigits: MarkupDigits,
  candidateMarkupDigits: MarkupDigits,
): boolean => {
  if (!isArrayOfMarkupDigits(sourceMarkupDigits))
    return !isArrayOfMarkupDigits(candidateMarkupDigits);

  if (!isArrayOfMarkupDigits(candidateMarkupDigits)) return false;

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
    isArrayOfMarkupDigits(sourceCellContent.centerMarkups) ||
    isArrayOfMarkupDigits(sourceCellContent.cornerMarkups);

  const doesCandidateCellContainAtLeastOneMarkupDigit =
    isArrayOfMarkupDigits(candidateCellContent.centerMarkups) ||
    isArrayOfMarkupDigits(candidateCellContent.cornerMarkups);

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
  (isArrayOfMarkupDigits(cellContent.centerMarkups) ||
    isArrayOfMarkupDigits(cellContent.cornerMarkups));

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

const getCellStateWithStrictMatchingSelection = (
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

const getCellStateWithPartialMatchingSelection = (
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
    return getCellStateWithSelectionIfMatchingMarkupColorsExist(
      sourceCellState.markupColors,
      candidateCellState.markupColors,
      candidateCellState,
    );

  if (
    isMarkupDigitsInCellContent(sourceCellContent) &&
    isMarkupDigitsInCellContent(candidateCellContent)
  )
    return getCellStateWithSelectionIfMatchingMarkupDigitsExist(
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

    const boardStateWithClearedSelections: BoardState = currentBoardState.map(
      (cellState) => ({
        ...cellState,
        isSelected: false,
      }),
    );

    const boardStateWithMatchingSelections: BoardState = strictHighlights
      ? boardStateWithClearedSelections.map((cellState) =>
          getCellStateWithStrictMatchingSelection(sourceCellState, cellState),
        )
      : boardStateWithClearedSelections.map((cellState) =>
          getCellStateWithPartialMatchingSelection(sourceCellState, cellState),
        );

    const nextBoardStateHistory = [...previousPuzzleHistory.boardStateHistory];
    nextBoardStateHistory[previousPuzzleHistory.currentBoardStateIndex] =
      boardStateWithMatchingSelections;

    const nextPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
  });
};
// #endregion

type CellProps = {
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
    const shouldShowRowAndColumnLabels = userSettings.showRowAndColumnLabels;

    const { cellContent } = cellState;

    const visibleCellText = getNonCornerDigitsInCellAsString(cellContent);

    const cornerMarkups = getCornerMarkups(cellContent);
    const cornerMarkupFloats = getCornerMarkupFloats(cornerMarkups);

    return (
      <Button
        background={getCellBackground({
          cellMarkupColors: cellState.markupColors,
          columnNumber: cellState.columnNumber,
          rowNumber: cellState.rowNumber,
          selectedColumnNumber,
          selectedRowNumber,
          hasDigitConflict,
          isSeenInBox,
          isSeenInColumn,
          isSeenInRow,
          showSeenCells: userSettings.showSeenCells,
        })}
        borderColor="black"
        borderRadius="0"
        color={isStartingDigitInCellContent(cellContent) ? "black" : "#1212f0"}
        data-cell-number={cellState.cellNumber}
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
        onDoubleClick={() =>
          handleCellDoubleClick(
            cellState,
            userSettings.strictHighlights,
            setPuzzleHistory,
          )
        }
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          handleCellPointerDown(cellState.cellNumber);
        }}
      >
        {shouldShowRowAndColumnLabels &&
          cellState.columnNumber === 1 &&
          getRowLabelFloat(cellState.rowNumber)}
        {shouldShowRowAndColumnLabels &&
          cellState.rowNumber === 1 &&
          getColumnLabelFloat(cellState.columnNumber)}
        {cornerMarkupFloats}
        {visibleCellText}
      </Button>
    );
  },
);
