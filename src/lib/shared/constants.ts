import { QueryClient } from "@tanstack/react-query";
import SuperExpressive from "super-expressive";

import type {
  BoardState,
  CellContent,
  CellState,
  PlayerDigit,
  RawBoardState,
  RawStartingDigit,
  SudokuDigit,
} from "./types";

export const queryClient = new QueryClient();

// Equivalent to: /^\d{81}$/
export const validRawSudokuStringRegEx = SuperExpressive()
  .startOfInput.exactly(81)
  .digit.endOfInput.toRegex();

export const encodeRawSudokuStringAsBase36String = (
  rawSudokuString: string,
): string => {
  if (!validRawSudokuStringRegEx.test(rawSudokuString)) {
    throw Error("Invalid raw sudoku string.");
  }

  const rawSudokuStringAsBigIntString = BigInt(rawSudokuString).toString(36);
  return rawSudokuStringAsBigIntString;
};

export const rawBoardStateToRawSudokuString = (
  rawBoardState: RawBoardState,
): string =>
  rawBoardState
    .map((cell) => (cell === null ? "0" : (cell + 1).toString()))
    .join("");

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

    const blankPlayerDigitCellContent: PlayerDigit = { playerDigit: "" };

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

export const getStartingOrPlayerDigitInCellIfPresent = (
  cellContent: CellContent,
): string => {
  if ("startingDigit" in cellContent) return cellContent.startingDigit;
  else if ("playerDigit" in cellContent) return cellContent.playerDigit;
  else return "";
};
