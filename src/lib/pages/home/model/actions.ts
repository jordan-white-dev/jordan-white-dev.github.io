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
  currentBoardState: BoardState,
  nextBoardState: BoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const didBoardStateChange =
    JSON.stringify(nextBoardState) !== JSON.stringify(currentBoardState);

  if (!didBoardStateChange) return;

  setPuzzleHistory((currentPuzzleHistory) => {
    const nextBoardStateIndex = currentPuzzleHistory.currentBoardStateIndex + 1;

    const nextBoardStateHistory = [
      ...currentPuzzleHistory.boardStateHistory.slice(0, nextBoardStateIndex),
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
  currentCellState: CellState,
  shouldPlayerDigitBeRemoved: boolean,
  sudokuDigit: SudokuDigit,
): CellState => {
  const isValidInputCell =
    currentCellState.isSelected &&
    !isStartingDigitInCellContent(currentCellState.cellContent);

  if (!isValidInputCell) return currentCellState;

  if (shouldPlayerDigitBeRemoved) {
    const emptyPlayerDigitCellState: CellState = {
      ...currentCellState,
      cellContent: {
        playerDigit: "",
      },
    };

    return emptyPlayerDigitCellState;
  }

  const addedPlayerDigitCellState: CellState = {
    ...currentCellState,
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

  const nextBoardState: BoardState = currentBoardState.map((currentCellState) =>
    getPlayerDigitCellState(
      currentCellState,
      shouldPlayerDigitBeRemoved,
      sudokuDigit,
    ),
  );

  addBoardStateToPuzzleHistory(
    currentBoardState,
    nextBoardState,
    setPuzzleHistory,
  );
};
// #endregion

// #region Markup Digit Input Actions
const areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup = (
  currentBoardState: BoardState,
  markupType: "Center" | "Corner",
  sudokuDigit: SudokuDigit,
): boolean =>
  currentBoardState.every((currentCellState) => {
    const cellContent = currentCellState.cellContent;

    if (!currentCellState.isSelected) return true;

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
  currentCellState: CellState,
  currentMarkups: Array<SudokuDigit>,
  markupType: "Center" | "Corner",
  sudokuDigit: SudokuDigit,
): CellState => {
  const currentCellContent = currentCellState.cellContent;

  if (!isMarkupDigitsInCellContent(currentCellContent)) return currentCellState;

  const currentMarkupsNotMatchingTheSudokuDigit = currentMarkups.filter(
    (currentMarkup) => currentMarkup !== sudokuDigit,
  );

  const nextMarkups: [""] | Array<SudokuDigit> =
    currentMarkupsNotMatchingTheSudokuDigit.length > 0
      ? currentMarkupsNotMatchingTheSudokuDigit
      : [""];

  const centerMarkups =
    markupType === "Center" ? nextMarkups : currentCellContent.centerMarkups;

  const cornerMarkups =
    markupType === "Corner" ? nextMarkups : currentCellContent.cornerMarkups;

  const cellContentAfterRemoveCheck: MarkupDigitsCellContent = {
    centerMarkups,
    cornerMarkups,
  };

  const nextCellState: CellState = {
    ...currentCellState,
    cellContent: cellContentAfterRemoveCheck,
  };

  return nextCellState;
};

const getCellStateWithAddedMarkupDigit = (
  currentCellState: CellState,
  currentMarkups: Array<SudokuDigit>,
  markupType: "Center" | "Corner",
  sudokuDigit: SudokuDigit,
): CellState => {
  const currentCellContent = currentCellState.cellContent;

  if (!isMarkupDigitsInCellContent(currentCellContent)) return currentCellState;

  const nextMarkups = currentMarkups.includes(sudokuDigit)
    ? currentMarkups
    : [...currentMarkups, sudokuDigit];

  const centerMarkups =
    markupType === "Center" ? nextMarkups : currentCellContent.centerMarkups;

  const cornerMarkups =
    markupType === "Corner" ? nextMarkups : currentCellContent.cornerMarkups;

  const cellContentAfterAddCheck: MarkupDigitsCellContent = {
    centerMarkups,
    cornerMarkups,
  };

  const nextCellState: CellState = {
    ...currentCellState,
    cellContent: cellContentAfterAddCheck,
  };

  return nextCellState;
};

const getCellStateWithAnEmptyMarkupType = (
  currentCellState: CellState,
  markupType: "Center" | "Corner",
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
    ...currentCellState,
    cellContent: nextMarkupDigitsCellContent,
  };

  return nextMarkupDigitsCellState;
};

const getMarkupDigitsCellState = (
  markupType: "Center" | "Corner",
  currentCellState: CellState,
  shouldMarkupDigitBeRemoved: boolean,
  sudokuDigit: SudokuDigit,
): CellState => {
  if (!currentCellState.isSelected) return currentCellState;

  const currentCellContent = currentCellState.cellContent;

  const isNotAStartingDigit = !isStartingDigitInCellContent(currentCellContent);

  const isAnEmptyPlayerDigit =
    isPlayerDigitInCellContent(currentCellContent) &&
    currentCellContent.playerDigit === "";

  const isValidInputCell =
    isNotAStartingDigit &&
    (isAnEmptyPlayerDigit || isMarkupDigitsInCellContent(currentCellContent));

  if (!isValidInputCell) return currentCellState;

  if (isMarkupDigitsInCellContent(currentCellContent)) {
    const currentMarkups =
      markupType === "Center"
        ? currentCellContent.centerMarkups.filter(isSudokuDigit)
        : currentCellContent.cornerMarkups.filter(isSudokuDigit);

    if (shouldMarkupDigitBeRemoved)
      return getCellStateWithRemovedMarkupDigit(
        currentCellState,
        currentMarkups,
        markupType,
        sudokuDigit,
      );

    return getCellStateWithAddedMarkupDigit(
      currentCellState,
      currentMarkups,
      markupType,
      sudokuDigit,
    );
  } else if (isPlayerDigitInCellContent(currentCellContent))
    return getCellStateWithAnEmptyMarkupType(
      currentCellState,
      markupType,
      sudokuDigit,
    );

  return currentCellState;
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

  const nextBoardState: BoardState = currentBoardState.map((currentCellState) =>
    getMarkupDigitsCellState(
      "Center",
      currentCellState,
      shouldMarkupDigitBeRemoved,
      sudokuDigit,
    ),
  );

  addBoardStateToPuzzleHistory(
    currentBoardState,
    nextBoardState,
    setPuzzleHistory,
  );
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

  const nextBoardState: BoardState = currentBoardState.map((currentCellState) =>
    getMarkupDigitsCellState(
      "Corner",
      currentCellState,
      shouldMarkupDigitBeRemoved,
      sudokuDigit,
    ),
  );

  addBoardStateToPuzzleHistory(
    currentBoardState,
    nextBoardState,
    setPuzzleHistory,
  );
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
    .filter((currentCellState) => currentCellState.isSelected)
    .every((currentCellState) =>
      currentCellState.markupColors
        .filter((currentMarkupColor) => currentMarkupColor !== "")
        .includes(markupColor),
    );

const getCellStateWithRemovedMarkupColor = (
  currentCellState: CellState,
  currentMarkupColors: Array<MarkupColor>,
  markupColor: MarkupColor,
): CellState => {
  const cellContentAfterRemoveCheck: Array<MarkupColor> =
    currentMarkupColors.filter(
      (currentMarkupColor) => currentMarkupColor !== markupColor,
    );

  if (cellContentAfterRemoveCheck.length > 0) {
    const nextCellState: CellState = {
      ...currentCellState,
      markupColors: cellContentAfterRemoveCheck,
    };

    return nextCellState;
  }

  const nextCellState: CellState = {
    ...currentCellState,
    markupColors: [""],
  };

  return nextCellState;
};

const getCellStateWithAddedMarkupColor = (
  currentCellState: CellState,
  currentMarkupColors: Array<MarkupColor>,
  markupColor: MarkupColor,
): CellState => {
  const cellContentAfterAddCheck: Array<MarkupColor> =
    currentMarkupColors.includes(markupColor)
      ? currentMarkupColors
      : [...currentMarkupColors, markupColor];

  const nextCellState: CellState = {
    ...currentCellState,
    markupColors: cellContentAfterAddCheck,
  };

  return nextCellState;
};

const getMarkupColorsCellState = (
  currentCellState: CellState,
  markupColor: MarkupColor,
  shouldMarkupColorBeRemoved: boolean,
): CellState => {
  if (!currentCellState.isSelected) return currentCellState;

  const currentMarkupColors = currentCellState.markupColors.filter(
    (currentMarkupColor) => currentMarkupColor !== "",
  );

  return shouldMarkupColorBeRemoved
    ? getCellStateWithRemovedMarkupColor(
        currentCellState,
        currentMarkupColors,
        markupColor,
      )
    : getCellStateWithAddedMarkupColor(
        currentCellState,
        currentMarkupColors,
        markupColor,
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

  const nextBoardState: BoardState = currentBoardState.map((currentCellState) =>
    getMarkupColorsCellState(
      currentCellState,
      markupColor,
      shouldMarkupColorBeRemoved,
    ),
  );

  addBoardStateToPuzzleHistory(
    currentBoardState,
    nextBoardState,
    setPuzzleHistory,
  );
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
    (currentCellState) => {
      if (!currentCellState.isSelected) return currentCellState;

      if (isStartingDigitInCellContent(currentCellState.cellContent)) {
        const nextCellState: CellState = {
          ...currentCellState,
          markupColors: [""],
        };

        return nextCellState;
      }

      const nextCellState: CellState = {
        ...currentCellState,
        cellContent: {
          playerDigit: "",
        },
        markupColors: [""],
      };

      return nextCellState;
    },
  );

  addBoardStateToPuzzleHistory(
    currentBoardState,
    nextBoardState,
    setPuzzleHistory,
  );
};
// #endregion

// #region Undo/Redo Actions
const canMoveBoardStateIndex = (
  indexDelta: -1 | 1,
  puzzleHistory: PuzzleHistory,
) => {
  const candidateIndex = puzzleHistory.currentBoardStateIndex + indexDelta;

  const canMoveIndex =
    candidateIndex >= 0 &&
    candidateIndex < puzzleHistory.boardStateHistory.length;

  return canMoveIndex;
};

const getPuzzleHistoryWithUpdatedIndex = (
  currentPuzzleHistory: PuzzleHistory,
  indexDelta: -1 | 1,
): PuzzleHistory => ({
  ...currentPuzzleHistory,
  currentBoardStateIndex:
    currentPuzzleHistory.currentBoardStateIndex + indexDelta,
});

const updateBoardStateIndex = (
  indexDelta: -1 | 1,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((currentPuzzleHistory) => {
    const nextPuzzleHistory = canMoveBoardStateIndex(
      indexDelta,
      currentPuzzleHistory,
    )
      ? getPuzzleHistoryWithUpdatedIndex(currentPuzzleHistory, indexDelta)
      : currentPuzzleHistory;

    return nextPuzzleHistory;
  });

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
