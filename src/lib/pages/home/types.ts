import SuperExpressive from "super-expressive";

import { branded } from "@/lib/types/branding";

type Prettify<TypeIntersectionToPrettify> = {
  [Property in keyof TypeIntersectionToPrettify]: TypeIntersectionToPrettify[Property];
} & unknown;

// #region Markup Colors
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

export const flippedColors = [
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
// #endregion

// #region Raw Types

// #region Raw Puzzle String
// Equivalent to: /^\d{81}$/
const validRawPuzzleStringRegex = SuperExpressive()
  .startOfInput.exactly(81)
  .digit.endOfInput.toRegex();

const [isRawPuzzleStringValidator, BrandedRawPuzzleString] = branded(
  (input: string) => validRawPuzzleStringRegex.test(input),
  "RawPuzzleString",
);

export const isRawPuzzleString = isRawPuzzleStringValidator;
export type RawPuzzleString = typeof BrandedRawPuzzleString;
// #endregion

// #region Raw Starting Digit
const [isRawStartingDigitValidator, BrandedRawStartingDigit] = branded(
  (input: number) => Number.isInteger(input) && input >= 0 && input <= 8,
  "RawStartingDigit",
);

export const isRawStartingDigit = isRawStartingDigitValidator;
export type RawStartingDigit = typeof BrandedRawStartingDigit;
// #endregion

type RawEmptyCell = null;
type RawCellState = RawStartingDigit | RawEmptyCell;
export type RawBoardState = Array<RawCellState>;
// #endregion

// #region Encoded Puzzle String
// Equivalent to: /^[\da-z]+$/
const validEncodedPuzzleStringRegex = SuperExpressive()
  .startOfInput.oneOrMore.anyOf.digit.range("a", "z")
  .end()
  .endOfInput.toRegex();

const [isEncodedPuzzleStringValidator, BrandedEncodedPuzzleString] = branded(
  (input: string) => validEncodedPuzzleStringRegex.test(input),
  "EncodedPuzzleString",
);

export const isEncodedPuzzleString = isEncodedPuzzleStringValidator;
export type EncodedPuzzleString = typeof BrandedEncodedPuzzleString;
// #endregion

// #region Sudoku Digits
const sudokuDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const flippedDigits = ["7", "8", "9", "4", "5", "6", "1", "2", "3"] as const;
const sudokuDigitStringSet = new Set<string>(sudokuDigits);

const [isSudokuDigitValidator, BrandedSudokuDigit] = branded(
  (input: string) => sudokuDigitStringSet.has(input),
  "SudokuDigit",
);

export const isSudokuDigit = isSudokuDigitValidator;
export type SudokuDigit = typeof BrandedSudokuDigit;

export const getSudokuDigitFromString = (
  candidateSudokuDigit: string,
): SudokuDigit => {
  if (!isSudokuDigit(candidateSudokuDigit))
    throw Error(
      `Failed to get a SudokuDigit from the candidate string "${candidateSudokuDigit}".`,
    );

  return candidateSudokuDigit;
};

export const brandedSudokuDigitsForFlippedKeypad: ReadonlyArray<SudokuDigit> =
  flippedDigits.map(getSudokuDigitFromString);
export const brandedSudokuDigits: ReadonlyArray<SudokuDigit> = sudokuDigits.map(
  getSudokuDigitFromString,
);
// #endregion

// #region Cell Content
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
// #endregion

// #region Cell State
const isNumberOneThroughNineValidator = (input: number) =>
  Number.isInteger(input) && input >= 1 && input <= 9;

// Box Number
const [isBoxNumberValidator, BrandedBoxNumber] = branded(
  isNumberOneThroughNineValidator,
  "BoxNumber",
);
export const isBoxNumber = isBoxNumberValidator;
export type BoxNumber = typeof BrandedBoxNumber;

// Column Number
const [isColumnNumberValidator, BrandedColumnNumber] = branded(
  isNumberOneThroughNineValidator,
  "ColumnNumber",
);
export const isColumnNumber = isColumnNumberValidator;
export type ColumnNumber = typeof BrandedColumnNumber;

// Row Number
const [isRowNumberValidator, BrandedRowNumber] = branded(
  isNumberOneThroughNineValidator,
  "RowNumber",
);
export const isRowNumber = isRowNumberValidator;
export type RowNumber = typeof BrandedRowNumber;

// Cell Number
const [isCellNumberValidator, BrandedCellNumber] = branded(
  (input: number) => Number.isInteger(input) && input >= 1 && input <= 81,
  "CellNumber",
);
export const isCellNumber = isCellNumberValidator;
export type CellNumber = typeof BrandedCellNumber;

export type CellState = {
  boxNumber: BoxNumber;
  cellContent: CellContent;
  cellNumber: CellNumber;
  columnNumber: ColumnNumber;
  isSelected: boolean;
  markupColors: [""] | Array<MarkupColor>;
  rowNumber: RowNumber;
};
// #endregion

export type BoardState = Array<CellState>;

export type PuzzleHistory = {
  currentBoardStateIndex: number;
  boardStateHistory: Array<BoardState>;
};

const keypadModes = ["Digit", "Color", "Center", "Corner"] as const;
export type KeypadMode = (typeof keypadModes)[number];
