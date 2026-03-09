export const MARKUP_COLOR_GRAY = "#666666";
export const MARKUP_COLOR_SILVER = "#b0b0b0";
export const MARKUP_COLOR_WHITE = "#ffffff";
export const MARKUP_COLOR_VIOLET = "#f690f6";
export const MARKUP_COLOR_RED = "#f76664";
export const MARKUP_COLOR_TAN = "#c69c78";
export const MARKUP_COLOR_ORANGE = "#f5ae51";
export const MARKUP_COLOR_YELLOW = "#ffff75";
export const MARKUP_COLOR_GREEN = "#d1efa6";

export const markupColors = [
  MARKUP_COLOR_GRAY,
  MARKUP_COLOR_SILVER,
  MARKUP_COLOR_WHITE,
  MARKUP_COLOR_VIOLET,
  MARKUP_COLOR_RED,
  MARKUP_COLOR_TAN,
  MARKUP_COLOR_ORANGE,
  MARKUP_COLOR_YELLOW,
  MARKUP_COLOR_GREEN,
] as const;
export type MarkupColor = (typeof markupColors)[number];

export const inputModes = ["Digit", "Color", "Center", "Corner"] as const;
export type InputMode = (typeof inputModes)[number];

export type RawStartingDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type RawCellState = RawStartingDigit | null;
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
export type SudokuDigit = (typeof sudokuDigits)[number];

export type StartingDigitCellContent = { startingDigit: SudokuDigit };
export type PlayerDigitCellContent = { playerDigit: SudokuDigit | "" };

export type MarkupDigits = [""] | Array<SudokuDigit>;
export type MarkupDigitsCellContent = {
  centerMarkups: MarkupDigits;
  cornerMarkups: MarkupDigits;
};
export type CellContent =
  | StartingDigitCellContent
  | PlayerDigitCellContent
  | MarkupDigitsCellContent;

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
