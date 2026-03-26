import {
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
} from "@/lib/pages/home/model/guards";
import {
  type BoardState,
  type BoxNumber,
  type CellContent,
  type CellNumber,
  type CellState,
  type ColumnNumber,
  type EncodedPuzzleString,
  type PlayerDigitCellContent,
  type PuzzleHistory,
  type RawBoardState,
  type RawPuzzleString,
  type RawStartingDigit,
  type RowNumber,
  type SudokuDigit,
} from "@/lib/pages/home/model/types";
import {
  isBoxNumber,
  isCellNumber,
  isColumnNumber,
  isEncodedPuzzleString,
  isRawPuzzleString,
  isRowNumber,
  isSudokuDigit,
} from "@/lib/pages/home/model/validators";

// #region Puzzle String Transforms
export const getEncodedPuzzleStringFromRawPuzzleString = (
  rawPuzzleString: RawPuzzleString,
): EncodedPuzzleString => {
  const candidateEncodedPuzzleString = BigInt(rawPuzzleString).toString(36);

  if (!isEncodedPuzzleString(candidateEncodedPuzzleString))
    throw Error(
      `Failed to get an EncodedPuzzleString from the RawPuzzleString "${rawPuzzleString}". The attempted final output "${candidateEncodedPuzzleString}" was invalid.`,
    );

  return candidateEncodedPuzzleString;
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
      `Failed to get a RawPuzzleString from the RawBoardState. The attempted final output "${candidateRawPuzzleString}" was invalid.`,
    );

  return candidateRawPuzzleString;
};
// #endregion

// #region Sudoku Digit Transform
export const getSudokuDigitFromString = (
  candidateSudokuDigit: string,
): SudokuDigit => {
  if (!isSudokuDigit(candidateSudokuDigit))
    throw Error(
      `Failed to get a SudokuDigit from the candidate string "${candidateSudokuDigit}".`,
    );

  return candidateSudokuDigit;
};
// #endregion

// #region Board State Transform

// #region Branded Transforms
const getBrandedBoxNumber = (candidateBoxNumber: number): BoxNumber => {
  if (!isBoxNumber(candidateBoxNumber))
    throw Error(
      `Encountered an invalid BoxNumber "${candidateBoxNumber}" while getting a BoardState from RawBoardState.`,
    );

  return candidateBoxNumber;
};

const getBrandedCellNumber = (candidateCellNumber: number): CellNumber => {
  if (!isCellNumber(candidateCellNumber))
    throw Error(
      `Encountered an invalid CellNumber "${candidateCellNumber}" while getting a BoardState from RawBoardState.`,
    );

  return candidateCellNumber;
};

const getBrandedColumnNumber = (
  candidateColumnNumber: number,
): ColumnNumber => {
  if (!isColumnNumber(candidateColumnNumber))
    throw Error(
      `Encountered an invalid ColumnNumber "${candidateColumnNumber}" while getting a BoardState from RawBoardState.`,
    );

  return candidateColumnNumber;
};

const getBrandedRowNumber = (candidateRowNumber: number): RowNumber => {
  if (!isRowNumber(candidateRowNumber))
    throw Error(
      `Encountered an invalid RowNumber "${candidateRowNumber}" while getting a BoardState from RawBoardState.`,
    );

  return candidateRowNumber;
};
// #endregion

const getStartingDigitCellContentFromRawStartingDigit = (
  rawStartingDigit: RawStartingDigit,
): CellContent => {
  const candidateSudokuDigit = (rawStartingDigit + 1).toString();

  if (isSudokuDigit(candidateSudokuDigit)) {
    const startingDigitCellContent = {
      startingDigit: candidateSudokuDigit,
    };

    return startingDigitCellContent;
  }

  throw Error(
    `Failed to get a starting SudokuDigit from the RawStartingDigit "${rawStartingDigit}".`,
  );
};

export const getBoardStateFromRawBoardState = (
  rawBoardState: RawBoardState,
): BoardState => {
  const boardState: BoardState = [];

  for (
    let candidateCellNumber = 1;
    candidateCellNumber <= 81;
    candidateCellNumber++
  ) {
    const candidateColumnNumber = ((candidateCellNumber - 1) % 9) + 1;
    const candidateRowNumber = Math.floor((candidateCellNumber - 1) / 9) + 1;
    const candidateBoxNumber =
      Math.floor((candidateRowNumber - 1) / 3) * 3 +
      Math.floor((candidateColumnNumber - 1) / 3) +
      1;

    const boxNumber = getBrandedBoxNumber(candidateBoxNumber);
    const cellNumber = getBrandedCellNumber(candidateCellNumber);
    const columnNumber = getBrandedColumnNumber(candidateColumnNumber);
    const rowNumber = getBrandedRowNumber(candidateRowNumber);

    const rawCellState = rawBoardState[candidateCellNumber - 1];

    const emptyPlayerDigitCellContent: PlayerDigitCellContent = {
      playerDigit: "",
    };

    const cellContent: CellContent =
      rawCellState === null
        ? emptyPlayerDigitCellContent
        : getStartingDigitCellContentFromRawStartingDigit(rawCellState);

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

export const getCurrentBoardStateFromPuzzleHistory = (
  puzzleHistory: PuzzleHistory,
): BoardState => {
  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  return currentBoardState;
};

export const getBoardStateWithNoCellsSelected = (
  boardState: BoardState,
): BoardState => {
  const nextBoardState = boardState.map((cellState) => {
    const nextCellState = cellState.isSelected
      ? {
          ...cellState,
          isSelected: false,
        }
      : cellState;

    return nextCellState;
  });

  return nextBoardState;
};
// #endregion

// #region Digit Accessor
export const getStartingOrPlayerDigitInCellIfPresent = (
  cellContent: CellContent,
): SudokuDigit | "" => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else return "";
};
// #endregion
