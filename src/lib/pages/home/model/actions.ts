import { type Dispatch, type SetStateAction } from "react";

import { markupColors } from "@/lib/pages/home/model/constants";
import {
  isMarkupDigitsInCellContent,
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
} from "@/lib/pages/home/model/guards";
import {
  type BoardState,
  type CellState,
  type MarkupColor,
  type MarkupDigitsCellContent,
  type PuzzleHistory,
  type SudokuDigit,
} from "@/lib/pages/home/model/types";
import { isSudokuDigit } from "@/lib/pages/home/model/validators";

// #region Shared Actions
const handleSetPuzzleHistory = (
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
// #endregion

// #region Digit Input Action
const areAllSelectedCellsStartingOrContainSudokuDigitAsPlayerDigit = (
  previousBoardState: BoardState,
  sudokuDigit: SudokuDigit,
): boolean =>
  previousBoardState.every(
    (previousCellState) =>
      !previousCellState.isSelected ||
      isStartingDigitInCellContent(previousCellState.cellContent) ||
      (isPlayerDigitInCellContent(previousCellState.cellContent) &&
        previousCellState.cellContent.playerDigit === sudokuDigit),
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
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldPlayerDigitBeRemoved =
    areAllSelectedCellsStartingOrContainSudokuDigitAsPlayerDigit(
      previousBoardState,
      sudokuDigit,
    );

  const nextBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      getPlayerDigitCellState(
        previousCellState,
        shouldPlayerDigitBeRemoved,
        sudokuDigit,
      ),
  );

  handleSetPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #region Markup Digit Input Actions
const areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup = (
  markupType: "Center" | "Corner",
  previousBoardState: BoardState,
  sudokuDigit: SudokuDigit,
): boolean =>
  previousBoardState.every((previousCellState) => {
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
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup(
      "Center",
      previousBoardState,
      sudokuDigit,
    );

  const nextBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      getMarkupDigitsCellState(
        "Center",
        previousCellState,
        shouldMarkupDigitBeRemoved,
        sudokuDigit,
      ),
  );

  handleSetPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #region Corner Markup Input Action
export const handleCornerMarkupInput = (
  puzzleHistory: PuzzleHistory,
  sudokuDigit: SudokuDigit,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainSudokuDigitAsMarkup(
      "Corner",
      previousBoardState,
      sudokuDigit,
    );

  const nextBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      getMarkupDigitsCellState(
        "Corner",
        previousCellState,
        shouldMarkupDigitBeRemoved,
        sudokuDigit,
      ),
  );

  handleSetPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion

// #endregion

// #region Markup Color Input Action
const getZeroBasedIndexFromSudokuDigit = (sudokuDigit: SudokuDigit): number =>
  Number(sudokuDigit) - 1;

const doAllSelectedCellsHaveTheMarkupColor = (
  markupColor: MarkupColor,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState
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
  colorValue: MarkupColor | SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const markupColor: MarkupColor = isSudokuDigit(colorValue)
    ? markupColors[getZeroBasedIndexFromSudokuDigit(colorValue)]
    : colorValue;

  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupColorBeRemoved = doAllSelectedCellsHaveTheMarkupColor(
    markupColor,
    previousBoardState,
  );

  const nextBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      getMarkupColorsCellState(
        markupColor,
        previousCellState,
        shouldMarkupColorBeRemoved,
      ),
  );

  handleSetPuzzleHistory(nextBoardState, setPuzzleHistory);
};

// #endregion

// #region Clear Cell Action
export const handleClearCell = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const nextBoardState: BoardState = previousBoardState.map(
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

  handleSetPuzzleHistory(nextBoardState, setPuzzleHistory);
};
// #endregion
