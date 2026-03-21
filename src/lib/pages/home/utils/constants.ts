import type { Dispatch, SetStateAction } from "react";

import {
  type BoardState,
  type BoxNumber,
  type CellContent,
  type CellNumber,
  type CellState,
  type ColumnNumber,
  type EncodedPuzzleString,
  isBoxNumber,
  isCellNumber,
  isColumnNumber,
  isEncodedPuzzleString,
  isRawPuzzleString,
  isRowNumber,
  isSudokuDigit,
  type MarkupColor,
  type MarkupDigits,
  type MarkupDigitsCellContent,
  markupColors,
  type PlayerDigitCellContent,
  type PuzzleHistory,
  type RawBoardState,
  type RawPuzzleString,
  type RawStartingDigit,
  type RowNumber,
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

const getBrandedBoxNumber = (candidateBoxNumber: number): BoxNumber => {
  if (!isBoxNumber(candidateBoxNumber))
    throw Error(
      `Encountered an invalid BoxNumber "${candidateBoxNumber}" while getting a BoardState from RawBoardState.`,
    );

  return candidateBoxNumber;
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

const getBrandedCellNumber = (candidateCellNumber: number): CellNumber => {
  if (!isCellNumber(candidateCellNumber))
    throw Error(
      `Encountered an invalid CellNumber "${candidateCellNumber}" while getting a BoardState from RawBoardState.`,
    );

  return candidateCellNumber;
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
    const candidateRowNumber = Math.floor((candidateCellNumber - 1) / 9) + 1;
    const candidateColumnNumber = ((candidateCellNumber - 1) % 9) + 1;
    const candidateBoxNumber =
      Math.floor((candidateRowNumber - 1) / 3) * 3 +
      Math.floor((candidateColumnNumber - 1) / 3) +
      1;

    const boxNumber = getBrandedBoxNumber(candidateBoxNumber);
    const columnNumber = getBrandedColumnNumber(candidateColumnNumber);
    const rowNumber = getBrandedRowNumber(candidateRowNumber);
    const cellNumber = getBrandedCellNumber(candidateCellNumber);

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

// #region Shared Keyboard / Keypad Actions

const handleSetPuzzleHistory = (
  newBoardState: BoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const newBoardStateIndex = previousPuzzleHistory.currentBoardStateIndex + 1;

    const newBoardStateHistory = [
      ...previousPuzzleHistory.boardStateHistory.slice(0, newBoardStateIndex),
      newBoardState,
    ];

    const newPuzzleHistory = {
      currentBoardStateIndex: newBoardStateIndex,
      boardStateHistory: newBoardStateHistory,
    };

    return newPuzzleHistory;
  });
};

const getUpdatedCellStateWithRemovedMarkupDigit = (
  sudokuDigit: SudokuDigit,
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
): CellState => {
  const previousCellContent = previousCellState.cellContent;

  if (!isMarkupDigitsInCellContent(previousCellContent))
    return previousCellState;

  const previousMarkupsNotMatchingTheSudokuDigit = previousMarkups.filter(
    (previousMarkup) => previousMarkup !== sudokuDigit,
  );

  const updatedMarkups: [""] | Array<SudokuDigit> =
    previousMarkupsNotMatchingTheSudokuDigit.length > 0
      ? previousMarkupsNotMatchingTheSudokuDigit
      : [""];

  const centerMarkups: MarkupDigits =
    markupType === "Center"
      ? updatedMarkups
      : previousCellContent.centerMarkups;

  const cornerMarkups: MarkupDigits =
    markupType === "Corner"
      ? updatedMarkups
      : previousCellContent.cornerMarkups;

  const updatedCellContentAfterRemoveCheck: MarkupDigitsCellContent = {
    centerMarkups,
    cornerMarkups,
  };

  const updatedCellState: CellState = {
    ...previousCellState,
    cellContent: updatedCellContentAfterRemoveCheck,
  };

  return updatedCellState;
};

const getUpdatedCellStateWithAddedMarkupDigit = (
  sudokuDigit: SudokuDigit,
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
): CellState => {
  const previousCellContent = previousCellState.cellContent;

  if (!isMarkupDigitsInCellContent(previousCellContent))
    return previousCellState;

  const updatedMarkups = previousMarkups.includes(sudokuDigit)
    ? previousMarkups
    : [...previousMarkups, sudokuDigit];

  const centerMarkups: MarkupDigits =
    markupType === "Center"
      ? updatedMarkups
      : previousCellContent.centerMarkups;

  const cornerMarkups: MarkupDigits =
    markupType === "Corner"
      ? updatedMarkups
      : previousCellContent.cornerMarkups;

  const updatedCellContentAfterAddCheck: MarkupDigitsCellContent = {
    centerMarkups,
    cornerMarkups,
  };

  const updatedCellState: CellState = {
    ...previousCellState,
    cellContent: updatedCellContentAfterAddCheck,
  };

  return updatedCellState;
};

const getUpdatedCellStateWithAnEmptyMarkupType = (
  sudokuDigit: SudokuDigit,
  markupType: "Center" | "Corner",
  previousCellState: CellState,
): CellState => {
  const newMarkupDigitsCellContent: MarkupDigitsCellContent =
    markupType === "Center"
      ? {
          centerMarkups: [sudokuDigit],
          cornerMarkups: [""],
        }
      : {
          centerMarkups: [""],
          cornerMarkups: [sudokuDigit],
        };

  const newMarkupDigitsCellState: CellState = {
    ...previousCellState,
    cellContent: newMarkupDigitsCellContent,
  };

  return newMarkupDigitsCellState;
};

const markupDigitsCellStateUpdater = (
  sudokuDigit: SudokuDigit,
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  shouldMarkupDigitBeRemoved: boolean,
): CellState => {
  if (!previousCellState.isSelected) return previousCellState;

  const previousCellContent = previousCellState.cellContent;

  const isNotAStartingDigit =
    !isStartingDigitInCellContent(previousCellContent);

  const isAnEmptyPlayerDigit =
    isPlayerDigitInCellContent(previousCellContent) &&
    previousCellContent.playerDigit === "";

  const isValidInputCell =
    isNotAStartingDigit &&
    (isAnEmptyPlayerDigit || isMarkupDigitsInCellContent(previousCellContent));

  if (!isValidInputCell) return previousCellState;

  if (isMarkupDigitsInCellContent(previousCellContent)) {
    const previousMarkups =
      markupType === "Center"
        ? previousCellContent.centerMarkups.filter(isSudokuDigit)
        : previousCellContent.cornerMarkups.filter(isSudokuDigit);

    if (shouldMarkupDigitBeRemoved)
      return getUpdatedCellStateWithRemovedMarkupDigit(
        sudokuDigit,
        markupType,
        previousCellState,
        previousMarkups,
      );

    return getUpdatedCellStateWithAddedMarkupDigit(
      sudokuDigit,
      markupType,
      previousCellState,
      previousMarkups,
    );
  } else if (isPlayerDigitInCellContent(previousCellContent))
    return getUpdatedCellStateWithAnEmptyMarkupType(
      sudokuDigit,
      markupType,
      previousCellState,
    );

  return previousCellState;
};

const areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup = (
  sudokuDigit: SudokuDigit,
  markupType: "Center" | "Corner",
  previousBoardState: BoardState,
): boolean =>
  previousBoardState.every((previousCellState) => {
    const cellContent = previousCellState.cellContent;

    return (
      !previousCellState.isSelected ||
      isStartingDigitInCellContent(cellContent) ||
      (isPlayerDigitInCellContent(cellContent) &&
        cellContent.playerDigit !== "") ||
      (isMarkupDigitsInCellContent(cellContent) &&
        (markupType === "Center"
          ? cellContent.centerMarkups
              .filter(isSudokuDigit)
              .includes(sudokuDigit)
          : cellContent.cornerMarkups
              .filter(isSudokuDigit)
              .includes(sudokuDigit)))
    );
  });

const playerDigitCellStateUpdater = (
  sudokuDigit: SudokuDigit,
  previousCellState: CellState,
  shouldPlayerDigitBeRemoved: boolean,
): CellState => {
  const isValidInputCell =
    previousCellState.isSelected &&
    !isStartingDigitInCellContent(previousCellState.cellContent);

  if (!isValidInputCell) return previousCellState;

  if (shouldPlayerDigitBeRemoved) {
    const emptyPlayerDigitCellState: CellState = {
      ...previousCellState,
      cellContent: {
        playerDigit: "",
      },
    };

    return emptyPlayerDigitCellState;
  }

  const addedPlayerDigitCellState: CellState = {
    ...previousCellState,
    cellContent: {
      playerDigit: sudokuDigit,
    },
  };

  return addedPlayerDigitCellState;
};

const areAllSelectedCellsStartingOrContainSudokuDigitAsPlayerDigit = (
  sudokuDigit: SudokuDigit,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState.every(
    (previousCellState) =>
      !previousCellState.isSelected ||
      isStartingDigitInCellContent(previousCellState.cellContent) ||
      (isPlayerDigitInCellContent(previousCellState.cellContent) &&
        previousCellState.cellContent.playerDigit === sudokuDigit),
  );

export const handleDigitInput = (
  sudokuDigit: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldPlayerDigitBeRemoved =
    areAllSelectedCellsStartingOrContainSudokuDigitAsPlayerDigit(
      sudokuDigit,
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      playerDigitCellStateUpdater(
        sudokuDigit,
        previousCellState,
        shouldPlayerDigitBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};

export const handleCenterMarkupInput = (
  sudokuDigit: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup(
      sudokuDigit,
      "Center",
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      markupDigitsCellStateUpdater(
        sudokuDigit,
        "Center",
        previousCellState,
        shouldMarkupDigitBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};

export const handleCornerMarkupInput = (
  sudokuDigit: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup(
      sudokuDigit,
      "Corner",
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      markupDigitsCellStateUpdater(
        sudokuDigit,
        "Corner",
        previousCellState,
        shouldMarkupDigitBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};

const doAllSelectedCellsHaveTheButtonColorAsAMarkup = (
  buttonColor: MarkupColor,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState
    .filter((previousCellState) => previousCellState.isSelected)
    .every((previousCellState) =>
      previousCellState.markupColors
        .filter((previousMarkupColor) => previousMarkupColor !== "")
        .includes(buttonColor),
    );

const getUpdatedCellStateWithRemovedMarkupColor = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  previousMarkupColors: Array<MarkupColor>,
): CellState => {
  const markupColorsCellContentAfterRemoveCheck: Array<MarkupColor> =
    previousMarkupColors.filter(
      (previousMarkupColor) => previousMarkupColor !== markupColor,
    );

  if (markupColorsCellContentAfterRemoveCheck.length > 0) {
    const markupColorsCellStateAfterRemoveCheck: CellState = {
      ...previousCellState,
      markupColors: markupColorsCellContentAfterRemoveCheck,
    };

    return markupColorsCellStateAfterRemoveCheck;
  }

  const markupColorsCellStateAfterRemoveCheck: CellState = {
    ...previousCellState,
    markupColors: [""],
  };

  return markupColorsCellStateAfterRemoveCheck;
};

const getUpdatedCellStateWithAddedMarkupColor = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  previousMarkupColors: Array<MarkupColor>,
): CellState => {
  const markupColorsCellContentAfterAddCheck: Array<MarkupColor> =
    previousMarkupColors.includes(markupColor)
      ? previousMarkupColors
      : [...previousMarkupColors, markupColor];

  const markupColorsCellStateAfterAddCheck: CellState = {
    ...previousCellState,
    markupColors: markupColorsCellContentAfterAddCheck,
  };

  return markupColorsCellStateAfterAddCheck;
};

const markupColorCellStateUpdater = (
  buttonColor: MarkupColor,
  previousCellState: CellState,
  shouldMarkupColorBeRemoved: boolean,
): CellState => {
  if (!previousCellState.isSelected) return previousCellState;

  const previousMarkupColors = previousCellState.markupColors.filter(
    (previousMarkupColor) => previousMarkupColor !== "",
  );

  return shouldMarkupColorBeRemoved
    ? getUpdatedCellStateWithRemovedMarkupColor(
        buttonColor,
        previousCellState,
        previousMarkupColors,
      )
    : getUpdatedCellStateWithAddedMarkupColor(
        buttonColor,
        previousCellState,
        previousMarkupColors,
      );
};

const getZeroBasedIndexFromSudokuDigit = (sudokuDigit: SudokuDigit): number =>
  Number(sudokuDigit) - 1;

export const handleColorPadInput = (
  colorValue: MarkupColor | SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const buttonColor: MarkupColor = isSudokuDigit(colorValue)
    ? markupColors[getZeroBasedIndexFromSudokuDigit(colorValue)]
    : colorValue;

  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupColorBeRemoved =
    doAllSelectedCellsHaveTheButtonColorAsAMarkup(
      buttonColor,
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      markupColorCellStateUpdater(
        buttonColor,
        previousCellState,
        shouldMarkupColorBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};

export const handleClearButton = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) => {
      if (!previousCellState.isSelected) return previousCellState;

      if (isStartingDigitInCellContent(previousCellState.cellContent)) {
        const newStartingDigitCellState: CellState = {
          ...previousCellState,
          markupColors: [""],
        };

        return newStartingDigitCellState;
      }

      const newPlayerDigitCellState: CellState = {
        ...previousCellState,
        cellContent: {
          playerDigit: "",
        },
        markupColors: [""],
      };

      return newPlayerDigitCellState;
    },
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};

// #endregion
