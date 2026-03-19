import type {
  BoardState,
  CellContent,
  CellState,
  MarkupColor,
  MarkupDigits,
  PlayerDigitCellContent,
  RawBoardState,
  RawPuzzleString,
  RawStartingDigit,
  SudokuDigit,
} from "./types";
import { isRawPuzzleString } from "./types";

export const encodeRawPuzzleStringAsBase36String = (
  rawPuzzleString: RawPuzzleString,
): string => {
  const base36String = BigInt(rawPuzzleString).toString(36);
  return base36String;
};

export const getRawPuzzleStringFromRawBoardState = (
  rawBoardState: RawBoardState,
): RawPuzzleString => {
  const candidateRawPuzzleString = rawBoardState
    .map((rawCellState) =>
      rawCellState === null ? "0" : (rawCellState + 1).toString(),
    )
    .join("");

  if (!isRawPuzzleString(candidateRawPuzzleString))
    throw Error(
      "Failed to build a valid raw puzzle string from the raw board state.",
    );

  return candidateRawPuzzleString;
};

export const buildBoardState = (rawBoardState: RawBoardState): BoardState => {
  const boardState: BoardState = [];

  for (let cellNumber = 1; cellNumber <= 81; cellNumber++) {
    const rowNumber = Math.floor((cellNumber - 1) / 9) + 1;
    const columnNumber = ((cellNumber - 1) % 9) + 1;
    const boxNumber =
      Math.floor((rowNumber - 1) / 3) * 3 +
      Math.floor((columnNumber - 1) / 3) +
      1;

    const rawCellState = rawBoardState[cellNumber - 1];

    const blankPlayerDigitCellContent: PlayerDigitCellContent = {
      playerDigit: "",
    };

    const getStartingDigitCellContent = (
      rawStartingDigit: RawStartingDigit,
    ): CellContent => ({
      startingDigit: (rawStartingDigit + 1).toString() as SudokuDigit,
    });

    const cellContent: CellContent =
      rawCellState === null
        ? blankPlayerDigitCellContent
        : getStartingDigitCellContent(rawCellState);

    const cellState: CellState = {
      boxNumber,
      cellContent,
      cellNumber,
      columnNumber,
      isSelected: false,
      markupColors: [""],
      rowNumber,
    };

    boardState.push(cellState);
  }

  return boardState;
};

export const isStartingDigitInCellContent = (cellContent: CellContent) =>
  "startingDigit" in cellContent;

export const isPlayerDigitInCellContent = (cellContent: CellContent) =>
  "playerDigit" in cellContent;

export const isMarkupDigitsInCellContent = (cellContent: CellContent) =>
  "centerMarkups" in cellContent && "cornerMarkups" in cellContent;

export const isStartingOrPlayerDigitInCellContent = (
  cellContent: CellContent,
) => "playerDigit" in cellContent || "startingDigit" in cellContent;

export const getStartingOrPlayerDigitInCellIfPresent = (
  cellContent: CellContent,
): string => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else return "";
};

export const isArrayOfSudokuDigits = (
  values: MarkupDigits,
): values is Array<SudokuDigit> => values[0] !== "";

export const isArrayOfMarkupColors = (
  values: [""] | Array<MarkupColor>,
): values is Array<MarkupColor> => values[0] !== "";

export const exhaustiveGuard = (_value: never): never => {
  throw Error(
    `Reached exhaustive guard function with an unexpected value: ${JSON.stringify(_value)}`,
  );
};
