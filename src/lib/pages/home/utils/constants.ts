import {
  type BoardState,
  type CellContent,
  type CellState,
  type EncodedPuzzleString,
  isEncodedPuzzleString,
  isRawPuzzleString,
  isSudokuDigit,
  type MarkupColor,
  type MarkupDigits,
  type PlayerDigitCellContent,
  type RawBoardState,
  type RawPuzzleString,
  type RawStartingDigit,
  type SudokuDigit,
} from "./types";

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

  for (let cellNumber = 1; cellNumber <= 81; cellNumber++) {
    const rowNumber = Math.floor((cellNumber - 1) / 9) + 1;
    const columnNumber = ((cellNumber - 1) % 9) + 1;
    const boxNumber =
      Math.floor((rowNumber - 1) / 3) * 3 +
      Math.floor((columnNumber - 1) / 3) +
      1;

    const rawCellState = rawBoardState[cellNumber - 1];

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
): SudokuDigit | "" => {
  if (isStartingDigitInCellContent(cellContent))
    return cellContent.startingDigit;
  else if (isPlayerDigitInCellContent(cellContent))
    return cellContent.playerDigit;
  else return "";
};

export const isArrayOfSudokuDigits = (
  values: MarkupDigits,
): values is Array<SudokuDigit> =>
  values.length > 0 && values.every((value) => isSudokuDigit(value));

export const isArrayOfMarkupColors = (
  values: [""] | Array<MarkupColor>,
): values is Array<MarkupColor> => values[0] !== "";

export const exhaustiveGuard = (_value: never): never => {
  throw Error(
    `Reached the exhaustive guard function with an unexpected value: ${JSON.stringify(_value)}`,
  );
};
