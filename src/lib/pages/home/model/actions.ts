import { type Dispatch, type SetStateAction } from "react";

import { markupColors } from "@/lib/pages/home/model/constants";
import {
  isMarkupDigitsInCellContent,
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
} from "@/lib/pages/home/model/guards";
import { getCurrentBoardStateFromPuzzleHistory } from "@/lib/pages/home/model/transforms";
import {
  type BoardState,
  type CellState,
  type MarkupColor,
  type MarkupDigitsCellContent,
  type PuzzleHistory,
  type SudokuDigit,
} from "@/lib/pages/home/model/types";
import { isSudokuDigit } from "@/lib/pages/home/model/validators";

// #region Input Actions
const addBoardStateToPuzzleHistory = (
  nextBoardState: BoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const nextBoardStateIndex =
      previousPuzzleHistory.currentBoardStateIndex + 1;

    const nextBoardStateHistory = [
      ...previousPuzzleHistory.boardStateHistory.slice(0, nextBoardStateIndex),
      nextBoardState,
    ];

    const nextPuzzleHistory = {
      currentBoardStateIndex: nextBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
  });
};

// #region Digit Input Action
const areAllSelectedCellsStartingOrContainSudokuDigitAsPlayerDigit = (
  currentBoardState: BoardState,
  sudokuDigit: SudokuDigit,
): boolean =>
  currentBoardState.every(
    (currentCellState) =>
      !currentCellState.isSelected ||
      isStartingDigitInCellContent(currentCellState.cellContent) ||
      (isPlayerDigitInCellContent(currentCellState.cellContent) &&
        currentCellState.cellContent.playerDigit === sudokuDigit),
  );

const getPlayerDigitCellState = (
  previousCellState: CellState,
  shouldPlayerDigitBeRemoved: boolean,
  sudokuDigit: SudokuDigit,
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

export const handleDigitInput = (
  puzzleHistory: PuzzleHistory,
  sudokuDigit: SudokuDigit,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    getCurrentBoardStateFromPuzzleHistory(puzzleHistory);

  const shouldPlayerDigitBeRemoved =
    areAllSelectedCellsStartingOrContainSudokuDigitAsPlayerDigit(
      currentBoardState,
      sudokuDigit,
    );

  const nextBoardState: BoardState = currentBoardState.map(
    (previousCellState) =>
      getPlayerDigitCellState(
        previousCellState,
        shouldPlayerDigitBeRemoved,
        sudokuDigit,
      ),
  );

  addBoardStateToPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #region Markup Digit Input Actions
const areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup = (
  currentBoardState: BoardState,
  markupType: "Center" | "Corner",
  sudokuDigit: SudokuDigit,
): boolean =>
  currentBoardState.every((previousCellState) => {
    const cellContent = previousCellState.cellContent;

    if (!previousCellState.isSelected) return true;

    if (isStartingDigitInCellContent(cellContent)) return true;

    const isNonEmptyPlayerDigit =
      isPlayerDigitInCellContent(cellContent) && cellContent.playerDigit !== "";

    if (isNonEmptyPlayerDigit) return true;

    const doesContainSudokuDigitAsMarkup =
      isMarkupDigitsInCellContent(cellContent) &&
      (markupType === "Center"
        ? cellContent.centerMarkups.filter(isSudokuDigit).includes(sudokuDigit)
        : cellContent.cornerMarkups
            .filter(isSudokuDigit)
            .includes(sudokuDigit));

    if (doesContainSudokuDigitAsMarkup) return true;

    return false;
  });

const getCellStateWithRemovedMarkupDigit = (
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
  sudokuDigit: SudokuDigit,
): CellState => {
  const previousCellContent = previousCellState.cellContent;

  if (!isMarkupDigitsInCellContent(previousCellContent))
    return previousCellState;

  const previousMarkupsNotMatchingTheSudokuDigit = previousMarkups.filter(
    (previousMarkup) => previousMarkup !== sudokuDigit,
  );

  const nextMarkups: [""] | Array<SudokuDigit> =
    previousMarkupsNotMatchingTheSudokuDigit.length > 0
      ? previousMarkupsNotMatchingTheSudokuDigit
      : [""];

  const centerMarkups =
    markupType === "Center" ? nextMarkups : previousCellContent.centerMarkups;

  const cornerMarkups =
    markupType === "Corner" ? nextMarkups : previousCellContent.cornerMarkups;

  const cellContentAfterRemoveCheck: MarkupDigitsCellContent = {
    centerMarkups,
    cornerMarkups,
  };

  const nextCellState: CellState = {
    ...previousCellState,
    cellContent: cellContentAfterRemoveCheck,
  };

  return nextCellState;
};

const getCellStateWithAddedMarkupDigit = (
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
  sudokuDigit: SudokuDigit,
): CellState => {
  const previousCellContent = previousCellState.cellContent;

  if (!isMarkupDigitsInCellContent(previousCellContent))
    return previousCellState;

  const nextMarkups = previousMarkups.includes(sudokuDigit)
    ? previousMarkups
    : [...previousMarkups, sudokuDigit];

  const centerMarkups =
    markupType === "Center" ? nextMarkups : previousCellContent.centerMarkups;

  const cornerMarkups =
    markupType === "Corner" ? nextMarkups : previousCellContent.cornerMarkups;

  const cellContentAfterAddCheck: MarkupDigitsCellContent = {
    centerMarkups,
    cornerMarkups,
  };

  const nextCellState: CellState = {
    ...previousCellState,
    cellContent: cellContentAfterAddCheck,
  };

  return nextCellState;
};

const getCellStateWithAnEmptyMarkupType = (
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  sudokuDigit: SudokuDigit,
): CellState => {
  const nextMarkupDigitsCellContent: MarkupDigitsCellContent =
    markupType === "Center"
      ? {
          centerMarkups: [sudokuDigit],
          cornerMarkups: [""],
        }
      : {
          centerMarkups: [""],
          cornerMarkups: [sudokuDigit],
        };

  const nextMarkupDigitsCellState: CellState = {
    ...previousCellState,
    cellContent: nextMarkupDigitsCellContent,
  };

  return nextMarkupDigitsCellState;
};

const getMarkupDigitsCellState = (
  markupType: "Center" | "Corner",
  previousCellState: CellState,
  shouldMarkupDigitBeRemoved: boolean,
  sudokuDigit: SudokuDigit,
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
      return getCellStateWithRemovedMarkupDigit(
        markupType,
        previousCellState,
        previousMarkups,
        sudokuDigit,
      );

    return getCellStateWithAddedMarkupDigit(
      markupType,
      previousCellState,
      previousMarkups,
      sudokuDigit,
    );
  } else if (isPlayerDigitInCellContent(previousCellContent))
    return getCellStateWithAnEmptyMarkupType(
      markupType,
      previousCellState,
      sudokuDigit,
    );

  return previousCellState;
};

// #region Center Markup Input Action
export const handleCenterMarkupInput = (
  puzzleHistory: PuzzleHistory,
  sudokuDigit: SudokuDigit,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    getCurrentBoardStateFromPuzzleHistory(puzzleHistory);

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup(
      currentBoardState,
      "Center",
      sudokuDigit,
    );

  const nextBoardState: BoardState = currentBoardState.map(
    (previousCellState) =>
      getMarkupDigitsCellState(
        "Center",
        previousCellState,
        shouldMarkupDigitBeRemoved,
        sudokuDigit,
      ),
  );

  addBoardStateToPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #region Corner Markup Input Action
export const handleCornerMarkupInput = (
  puzzleHistory: PuzzleHistory,
  sudokuDigit: SudokuDigit,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    getCurrentBoardStateFromPuzzleHistory(puzzleHistory);

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup(
      currentBoardState,
      "Corner",
      sudokuDigit,
    );

  const nextBoardState: BoardState = currentBoardState.map(
    (previousCellState) =>
      getMarkupDigitsCellState(
        "Corner",
        previousCellState,
        shouldMarkupDigitBeRemoved,
        sudokuDigit,
      ),
  );

  addBoardStateToPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #endregion

// #region Markup Color Input Action
const getZeroBasedIndexFromSudokuDigit = (sudokuDigit: SudokuDigit): number =>
  Number(sudokuDigit) - 1;

const doAllSelectedCellsHaveTheMarkupColor = (
  currentBoardState: BoardState,
  markupColor: MarkupColor,
): boolean =>
  currentBoardState
    .filter((previousCellState) => previousCellState.isSelected)
    .every((previousCellState) =>
      previousCellState.markupColors
        .filter((previousMarkupColor) => previousMarkupColor !== "")
        .includes(markupColor),
    );

const getCellStateWithRemovedMarkupColor = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  previousMarkupColors: Array<MarkupColor>,
): CellState => {
  const cellContentAfterRemoveCheck: Array<MarkupColor> =
    previousMarkupColors.filter(
      (previousMarkupColor) => previousMarkupColor !== markupColor,
    );

  if (cellContentAfterRemoveCheck.length > 0) {
    const nextCellState: CellState = {
      ...previousCellState,
      markupColors: cellContentAfterRemoveCheck,
    };

    return nextCellState;
  }

  const nextCellState: CellState = {
    ...previousCellState,
    markupColors: [""],
  };

  return nextCellState;
};

const getCellStateWithAddedMarkupColor = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  previousMarkupColors: Array<MarkupColor>,
): CellState => {
  const cellContentAfterAddCheck: Array<MarkupColor> =
    previousMarkupColors.includes(markupColor)
      ? previousMarkupColors
      : [...previousMarkupColors, markupColor];

  const nextCellState: CellState = {
    ...previousCellState,
    markupColors: cellContentAfterAddCheck,
  };

  return nextCellState;
};

const getMarkupColorsCellState = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  shouldMarkupColorBeRemoved: boolean,
): CellState => {
  if (!previousCellState.isSelected) return previousCellState;

  const previousMarkupColors = previousCellState.markupColors.filter(
    (previousMarkupColor) => previousMarkupColor !== "",
  );

  return shouldMarkupColorBeRemoved
    ? getCellStateWithRemovedMarkupColor(
        markupColor,
        previousCellState,
        previousMarkupColors,
      )
    : getCellStateWithAddedMarkupColor(
        markupColor,
        previousCellState,
        previousMarkupColors,
      );
};

export const handleColorPadInput = (
  puzzleHistory: PuzzleHistory,
  markupValue: MarkupColor | SudokuDigit,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const markupColor: MarkupColor = isSudokuDigit(markupValue)
    ? markupColors[getZeroBasedIndexFromSudokuDigit(markupValue)]
    : markupValue;

  const currentBoardState =
    getCurrentBoardStateFromPuzzleHistory(puzzleHistory);

  const shouldMarkupColorBeRemoved = doAllSelectedCellsHaveTheMarkupColor(
    currentBoardState,
    markupColor,
  );

  const nextBoardState: BoardState = currentBoardState.map(
    (previousCellState) =>
      getMarkupColorsCellState(
        markupColor,
        previousCellState,
        shouldMarkupColorBeRemoved,
      ),
  );

  addBoardStateToPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #endregion

// #region Clear Cell Action
export const handleClearCell = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    getCurrentBoardStateFromPuzzleHistory(puzzleHistory);

  const nextBoardState: BoardState = currentBoardState.map(
    (previousCellState) => {
      if (!previousCellState.isSelected) return previousCellState;

      if (isStartingDigitInCellContent(previousCellState.cellContent)) {
        const nextCellState: CellState = {
          ...previousCellState,
          markupColors: [""],
        };

        return nextCellState;
      }

      const nextCellState: CellState = {
        ...previousCellState,
        cellContent: {
          playerDigit: "",
        },
        markupColors: [""],
      };

      return nextCellState;
    },
  );

  addBoardStateToPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #region Undo/Redo Actions
const canMoveBoardStateIndex = (
  indexDelta: -1 | 1,
  puzzleHistory: PuzzleHistory,
) => {
  const candidateIndex = puzzleHistory.currentBoardStateIndex + indexDelta;

  return (
    candidateIndex >= 0 &&
    candidateIndex < puzzleHistory.boardStateHistory.length
  );
};

const getPuzzleHistoryWithUpdatedIndex = (
  indexDelta: -1 | 1,
  previousPuzzleHistory: PuzzleHistory,
): PuzzleHistory => ({
  ...previousPuzzleHistory,
  currentBoardStateIndex:
    previousPuzzleHistory.currentBoardStateIndex + indexDelta,
});

const updateBoardStateIndex = (
  indexDelta: -1 | 1,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) =>
    canMoveBoardStateIndex(indexDelta, previousPuzzleHistory)
      ? getPuzzleHistoryWithUpdatedIndex(indexDelta, previousPuzzleHistory)
      : previousPuzzleHistory,
  );

// #region Undo Move Action
export const handleUndoMove = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => updateBoardStateIndex(-1, setPuzzleHistory);
// #endregion

// #region Redo Move Action
export const handleRedoMove = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => updateBoardStateIndex(1, setPuzzleHistory);
// #endregion

// #endregion
