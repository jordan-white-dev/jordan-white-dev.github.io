import { QueryClient } from "@tanstack/react-query";
import { makepuzzle } from "sudoku";

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

export const encodeSudoku = (puzzle: string): string => {
  // biome-ignore lint/performance/useTopLevelRegex: TODO
  if (!/^[0-9]{81}$/.test(puzzle)) {
    throw Error("Invalid puzzle");
  }

  return BigInt(puzzle).toString(36);
};

export const decodeSudoku = (encoded: string): string => {
  const decoded = BigInt(`0x${BigInt(encoded).toString(16)}`)
    .toString(10)
    .padStart(81, "0");

  // biome-ignore lint/performance/useTopLevelRegex: TODO
  if (!/^[0-9]{81}$/.test(decoded)) {
    throw Error("Invalid puzzle encoding");
  }

  return decoded;
};

const getDigitDisplayValue = (cellState: CellState): string | undefined => {
  if ("startingDigit" in cellState.cellContent)
    return cellState.cellContent.startingDigit;
  else if ("playerDigit" in cellState.cellContent)
    return cellState.cellContent.playerDigit;
  else if (
    "centerMarkups" in cellState.cellContent ||
    "cornerMarkups" in cellState.cellContent
  )
    return undefined;
};

export const getIsPuzzleSolved = (boardState: BoardState): boolean => {
  const rows: Array<Set<string>> = Array.from({ length: 9 }, () => new Set());
  const columns: Array<Set<string>> = Array.from(
    { length: 9 },
    () => new Set(),
  );
  const boxes: Array<Set<string>> = Array.from({ length: 9 }, () => new Set());

  for (const cellState of boardState) {
    const digit = getDigitDisplayValue(cellState);
    if (!digit || digit === "") return false;

    const rowIndex = cellState.rowNumber - 1;
    const columnIndex = cellState.columnNumber - 1;
    const boxIndex = cellState.boxNumber - 1;

    if (rows[rowIndex].has(digit)) return false;
    if (columns[columnIndex].has(digit)) return false;
    if (boxes[boxIndex].has(digit)) return false;

    rows[rowIndex].add(digit);
    columns[columnIndex].add(digit);
    boxes[boxIndex].add(digit);
  }

  return true;
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

    const blankPlayerDigitCellContent: PlayerDigit = { playerDigit: "" };

    const getStartingDigitCellContent = (rawCellState: RawStartingDigit) => ({
      startingDigit: (rawCellState + 1).toString() as SudokuDigit,
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

type StartingBoardStates = {
  rawBoardState: RawBoardState;
  boardState: BoardState;
};

export const getNewStartingBoardStates = (): StartingBoardStates => {
  const rawBoardState: RawBoardState = makepuzzle();
  const boardState: BoardState = buildBoardState(rawBoardState);

  const startingBoardStates = { rawBoardState, boardState };

  return startingBoardStates;
};
