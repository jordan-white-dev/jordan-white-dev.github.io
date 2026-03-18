export type Prettify<TypeIntersectionToPrettify> = {
  [Property in keyof TypeIntersectionToPrettify]: TypeIntersectionToPrettify[Property];
} & unknown;

export const MARKUP_COLOR_GRAY = "#c2bcbc";
export const MARKUP_COLOR_WHITE = "#ffffff";
export const MARKUP_COLOR_PINK = "#f79cf7";
export const MARKUP_COLOR_RED = "#f98987";
export const MARKUP_COLOR_ORANGE = "#f5ae51";
export const MARKUP_COLOR_YELLOW = "#fef28c";
export const MARKUP_COLOR_GREEN = "#94cb9c";
export const MARKUP_COLOR_BLUE = "#8cc2fa";
export const MARKUP_COLOR_PURPLE = "#bf5fca";

export const markupColors = [
  MARKUP_COLOR_GRAY,
  MARKUP_COLOR_WHITE,
  MARKUP_COLOR_PINK,
  MARKUP_COLOR_RED,
  MARKUP_COLOR_ORANGE,
  MARKUP_COLOR_YELLOW,
  MARKUP_COLOR_GREEN,
  MARKUP_COLOR_BLUE,
  MARKUP_COLOR_PURPLE,
] as const;
export const flippedKeypadMarkupColors = [
  MARKUP_COLOR_GREEN,
  MARKUP_COLOR_BLUE,
  MARKUP_COLOR_PURPLE,
  MARKUP_COLOR_RED,
  MARKUP_COLOR_ORANGE,
  MARKUP_COLOR_YELLOW,
  MARKUP_COLOR_GRAY,
  MARKUP_COLOR_WHITE,
  MARKUP_COLOR_PINK,
] as const;
export type MarkupColor = (typeof markupColors)[number];

const keypadModes = ["Digit", "Color", "Center", "Corner"] as const;
export type KeypadMode = (typeof keypadModes)[number];

export type RawStartingDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type RawCellState = Prettify<RawStartingDigit | null>;
export type RawBoardState = Array<RawCellState>;

export const sudokuDigits = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;
export const flippedKeypadSudokuDigits = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
] as const;
export type SudokuDigit = (typeof sudokuDigits)[number];

export type StartingDigitCellContent = { startingDigit: SudokuDigit };
export type PlayerDigitCellContent = { playerDigit: SudokuDigit | "" };

export type MarkupDigits = [""] | Array<SudokuDigit>;
export type MarkupDigitsCellContent = {
  centerMarkups: MarkupDigits;
  cornerMarkups: MarkupDigits;
};
export type CellContent = Prettify<
  StartingDigitCellContent | PlayerDigitCellContent | MarkupDigitsCellContent
>;

export type CellState = {
  boxNumber: number;
  cellContent: CellContent;
  cellNumber: number;
  columnNumber: number;
  isSelected: boolean;
  markupColors: [""] | Array<MarkupColor>;
  rowNumber: number;
};

export type BoardState = Array<CellState>;

export type PuzzleHistory = {
  currentBoardStateIndex: number;
  boardStateHistory: Array<BoardState>;
};
