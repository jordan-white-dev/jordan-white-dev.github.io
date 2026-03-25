import { SimpleGrid } from "@chakra-ui/react";
import {
  type Dispatch,
  type PointerEvent,
  type RefObject,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useUserSettings } from "@/lib/pages/home/hooks/use-user-settings";
import { getStartingOrPlayerDigitInCellIfPresent } from "@/lib/pages/home/model/constants";
import {
  type BoardState,
  type CellNumber,
  type CellState,
  type ColumnNumber,
  isCellNumber,
  isColumnNumber,
  isRowNumber,
  type PuzzleHistory,
  type RowNumber,
  type SudokuDigit,
} from "@/lib/pages/home/types";

import { Cell } from "./cell";

// #region Arrow Key Direction
type ArrowKeyDirection = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

const arrowKeyDirectionOffsets: Record<
  ArrowKeyDirection,
  { columnOffset: number; rowOffset: number }
> = {
  ArrowUp: { columnOffset: 0, rowOffset: -1 },
  ArrowDown: { columnOffset: 0, rowOffset: 1 },
  ArrowLeft: { columnOffset: -1, rowOffset: 0 },
  ArrowRight: { columnOffset: 1, rowOffset: 0 },
};

const isArrowKeyDirection = (
  keyboardKey: string,
): keyboardKey is ArrowKeyDirection => keyboardKey in arrowKeyDirectionOffsets;
// #endregion

// #region Conflict Cell Checking
const getEmptyDigitOccurrencesByRegion = (): Array<
  Map<SudokuDigit, Array<CellNumber>>
> => Array.from({ length: 9 }, () => new Map());

const addSudokuDigitOccurrenceToRegion = (
  cellNumber: CellNumber,
  sudokuDigit: SudokuDigit,
  sudokuDigitOccurrencesByRegion: Map<SudokuDigit, Array<CellNumber>>,
): void => {
  const matchingCellNumbers =
    sudokuDigitOccurrencesByRegion.get(sudokuDigit) ?? [];
  matchingCellNumbers.push(cellNumber);
  sudokuDigitOccurrencesByRegion.set(sudokuDigit, matchingCellNumbers);
};

const addConflictedCellNumbersFromRegion = (
  conflictedCellNumbers: Set<CellNumber>,
  sudokuDigitOccurrencesByRegion: Map<SudokuDigit, Array<CellNumber>>,
): void => {
  for (const matchingCellNumbers of sudokuDigitOccurrencesByRegion.values()) {
    if (matchingCellNumbers.length <= 1) continue;

    for (const cellNumber of matchingCellNumbers)
      conflictedCellNumbers.add(cellNumber);
  }
};

const addConflictedCellNumbersFromRegions = (
  conflictedCellNumbers: Set<CellNumber>,
  sudokuDigitOccurrencesByRegion: Array<Map<SudokuDigit, Array<CellNumber>>>,
): void => {
  for (const sudokuDigitOccurrenceByRegion of sudokuDigitOccurrencesByRegion)
    addConflictedCellNumbersFromRegion(
      conflictedCellNumbers,
      sudokuDigitOccurrenceByRegion,
    );
};

const getConflictedCellNumbers = (boardState: BoardState): Set<CellNumber> => {
  const conflictedCellNumbers = new Set<CellNumber>();

  const sudokuDigitOccurrencesByBox = getEmptyDigitOccurrencesByRegion();
  const sudokuDigitOccurrencesByColumn = getEmptyDigitOccurrencesByRegion();
  const sudokuDigitOccurrencesByRow = getEmptyDigitOccurrencesByRegion();

  for (const cellState of boardState) {
    const sudokuDigit = getStartingOrPlayerDigitInCellIfPresent(
      cellState.cellContent,
    );

    if (sudokuDigit === "") continue;

    addSudokuDigitOccurrenceToRegion(
      cellState.cellNumber,
      sudokuDigit,
      sudokuDigitOccurrencesByRow[cellState.rowNumber - 1],
    );
    addSudokuDigitOccurrenceToRegion(
      cellState.cellNumber,
      sudokuDigit,
      sudokuDigitOccurrencesByColumn[cellState.columnNumber - 1],
    );
    addSudokuDigitOccurrenceToRegion(
      cellState.cellNumber,
      sudokuDigit,
      sudokuDigitOccurrencesByBox[cellState.boxNumber - 1],
    );
  }

  addConflictedCellNumbersFromRegions(
    conflictedCellNumbers,
    sudokuDigitOccurrencesByRow,
  );
  addConflictedCellNumbersFromRegions(
    conflictedCellNumbers,
    sudokuDigitOccurrencesByColumn,
  );
  addConflictedCellNumbersFromRegions(
    conflictedCellNumbers,
    sudokuDigitOccurrencesByBox,
  );

  return conflictedCellNumbers;
};
// #endregion

// #region Cell Selection
const didBoardStateChange = (
  nextBoardState: BoardState,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState.some(
    (cellState, cellIndex) => cellState !== nextBoardState[cellIndex],
  );

// #region Add to Cell Selection + Move Cell Selection
const isCellSelected = (
  boardState: BoardState,
  candidateCellNumber: CellNumber,
): boolean =>
  boardState.some(
    (cellState) =>
      cellState.cellNumber === candidateCellNumber && cellState.isSelected,
  );

const getSelectedCellStates = (boardState: BoardState): Array<CellState> =>
  boardState.filter((cellState) => cellState.isSelected);

const getSelectionAnchorCellNumber = (
  boardState: BoardState,
  lastSelectedCellNumber: CellNumber | undefined,
): CellNumber | undefined => {
  if (
    lastSelectedCellNumber !== undefined &&
    isCellSelected(boardState, lastSelectedCellNumber)
  )
    return lastSelectedCellNumber;

  const selectedCellStates = getSelectedCellStates(boardState);
  return selectedCellStates[selectedCellStates.length - 1]?.cellNumber;
};

const getWrappedCellNumberInDirection = (
  arrowKeyDirection: ArrowKeyDirection,
  startingCellNumber: CellNumber,
): CellNumber => {
  const zeroBasedStartingCellNumber = startingCellNumber - 1;
  const startingColumnNumber = zeroBasedStartingCellNumber % 9;
  const startingRowNumber = Math.floor(zeroBasedStartingCellNumber / 9);

  const { columnOffset, rowOffset } =
    arrowKeyDirectionOffsets[arrowKeyDirection];

  const wrappedColumnNumber = (startingColumnNumber + columnOffset + 9) % 9;
  const wrappedRowNumber = (startingRowNumber + rowOffset + 9) % 9;
  const candidateCellNumber = wrappedRowNumber * 9 + wrappedColumnNumber + 1;

  if (!isCellNumber(candidateCellNumber))
    throw Error(
      `Failed to get a wrapped CellNumber from "${startingCellNumber}" in arrow key direction "${arrowKeyDirection}".`,
    );

  return candidateCellNumber;
};

const handleSetPuzzleHistoryForCellSelectionAddOrMove = (
  arrowKeyDirection: ArrowKeyDirection,
  lastSelectedCellNumber: CellNumber | undefined,
  getBoardStateForCellSelectionAddOrMove: (
    boardState: BoardState,
    targetCellNumber: CellNumber,
  ) => BoardState,
  setLastSelectedCellNumber: (cellNumber: CellNumber) => void,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const selectionAnchorCellNumber = getSelectionAnchorCellNumber(
      previousBoardState,
      lastSelectedCellNumber,
    );

    if (selectionAnchorCellNumber === undefined) return previousPuzzleHistory;

    const nextCellNumber = getWrappedCellNumberInDirection(
      arrowKeyDirection,
      selectionAnchorCellNumber,
    );

    const nextBoardState = getBoardStateForCellSelectionAddOrMove(
      previousBoardState,
      nextCellNumber,
    );

    if (!didBoardStateChange(nextBoardState, previousBoardState))
      return previousPuzzleHistory;

    setLastSelectedCellNumber(nextCellNumber);

    const nextBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (boardState, boardStateIndex) =>
        boardStateIndex === previousPuzzleHistory.currentBoardStateIndex
          ? nextBoardState
          : boardState,
    );

    const nextPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
  });

const getBoardStateWithTargetCellAddedToSelection = (
  boardState: BoardState,
  targetCellNumber: CellNumber,
): BoardState =>
  boardState.map((cellState) =>
    cellState.cellNumber === targetCellNumber && !cellState.isSelected
      ? {
          ...cellState,
          isSelected: true,
        }
      : cellState,
  );

const handleAddToCellSelectionInDirection = (
  arrowKeyDirection: ArrowKeyDirection,
  lastSelectedCellNumber: CellNumber | undefined,
  setLastSelectedCellNumber: (cellNumber: CellNumber) => void,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  handleSetPuzzleHistoryForCellSelectionAddOrMove(
    arrowKeyDirection,
    lastSelectedCellNumber,
    getBoardStateWithTargetCellAddedToSelection,
    setLastSelectedCellNumber,
    setPuzzleHistory,
  );

const getBoardStateWithOnlyTargetCellSelected = (
  boardState: BoardState,
  targetCellNumber: CellNumber,
): BoardState =>
  boardState.map((cellState) => {
    const shouldBeSelected = cellState.cellNumber === targetCellNumber;

    const nextBoardState =
      shouldBeSelected === cellState.isSelected
        ? cellState
        : {
            ...cellState,
            isSelected: shouldBeSelected,
          };

    return nextBoardState;
  });

const handleMoveSingleCellSelectionInDirection = (
  arrowKeyDirection: ArrowKeyDirection,
  lastSelectedCellNumber: CellNumber | undefined,
  setLastSelectedCellNumber: (cellNumber: CellNumber) => void,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  handleSetPuzzleHistoryForCellSelectionAddOrMove(
    arrowKeyDirection,
    lastSelectedCellNumber,
    getBoardStateWithOnlyTargetCellSelected,
    setLastSelectedCellNumber,
    setPuzzleHistory,
  );
// #endregion

// #region Board-Level Cell Selection
const handleSetPuzzleHistoryForBoardLevelCellSelection = (
  getNextBoardState: (previousBoardState: BoardState) => BoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const nextBoardState = getNextBoardState(previousBoardState);

    if (!didBoardStateChange(nextBoardState, previousBoardState))
      return previousPuzzleHistory;

    const nextBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (boardState, boardStateIndex) =>
        boardStateIndex === previousPuzzleHistory.currentBoardStateIndex
          ? nextBoardState
          : boardState,
    );

    return {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };
  });

const getBoardStateWithNoCellsSelected = (boardState: BoardState): BoardState =>
  boardState.map((cellState) =>
    cellState.isSelected
      ? {
          ...cellState,
          isSelected: false,
        }
      : cellState,
  );

const handleDeselectAllCells = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  handleSetPuzzleHistoryForBoardLevelCellSelection(
    getBoardStateWithNoCellsSelected,
    setPuzzleHistory,
  );

const getBoardStateWithAllCellsSelected = (
  boardState: BoardState,
): BoardState =>
  boardState.map((cellState) =>
    cellState.isSelected
      ? cellState
      : {
          ...cellState,
          isSelected: true,
        },
  );

const handleSelectAllCells = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  handleSetPuzzleHistoryForBoardLevelCellSelection(
    getBoardStateWithAllCellsSelected,
    setPuzzleHistory,
  );

const getBoardStateWithInvertedSelections = (
  boardState: BoardState,
): BoardState =>
  boardState.map((cellState) => ({
    ...cellState,
    isSelected: !cellState.isSelected,
  }));

const handleInvertSelectedCells = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  handleSetPuzzleHistoryForBoardLevelCellSelection(
    getBoardStateWithInvertedSelections,
    setPuzzleHistory,
  );
// #endregion

// #endregion

// #region Pointer Drag Handling
type BoardPosition = {
  cellNumber: CellNumber;
  columnNumber: ColumnNumber;
  rowNumber: RowNumber;
};

const handleBoardPointerUpOrCancel = (
  isPointerDraggingAcrossBoardRef: RefObject<boolean>,
  previousBoardPositionDuringDragRef: RefObject<BoardPosition | undefined>,
) => {
  isPointerDraggingAcrossBoardRef.current = false;
  previousBoardPositionDuringDragRef.current = undefined;
};

const getBoardPositionFromPointerCoordinates = (
  boardElement: HTMLDivElement,
  pointerClientX: number,
  pointerClientY: number,
): BoardPosition | undefined => {
  const boardBounds = boardElement.getBoundingClientRect();

  const isPointerOutsideBoardHorizontally =
    pointerClientX < boardBounds.left || pointerClientX > boardBounds.right;
  const isPointerOutsideBoardVertically =
    pointerClientY < boardBounds.top || pointerClientY > boardBounds.bottom;

  if (isPointerOutsideBoardHorizontally || isPointerOutsideBoardVertically)
    return undefined;

  const cellHeight = boardBounds.height / 9;
  const cellWidth = boardBounds.width / 9;

  const zeroBasedColumnNumber = Math.min(
    8,
    Math.max(0, Math.floor((pointerClientX - boardBounds.left) / cellWidth)),
  );
  const zeroBasedRowNumber = Math.min(
    8,
    Math.max(0, Math.floor((pointerClientY - boardBounds.top) / cellHeight)),
  );

  const cellNumber = zeroBasedRowNumber * 9 + zeroBasedColumnNumber + 1;
  const columnNumber = zeroBasedColumnNumber + 1;
  const rowNumber = zeroBasedRowNumber + 1;

  if (
    isCellNumber(cellNumber) &&
    isColumnNumber(columnNumber) &&
    isRowNumber(rowNumber)
  ) {
    const boardPosition = {
      cellNumber,
      columnNumber,
      rowNumber,
    };

    return boardPosition;
  }

  throw Error(
    `Failed to get BoardPosition from pointer coordinates x: "${pointerClientX}" and y: "${pointerClientY}".`,
  );
};

const handleMultiCellSelectionDuringPointerDrag = (
  cellNumbersCrossedDuringDrag: Array<CellNumber>,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const draggedCellNumbers = new Set(cellNumbersCrossedDuringDrag);

    const boardStateWithUpdatedSelections = previousBoardState.map(
      (cellState) => {
        const shouldBeSelected = draggedCellNumbers.has(cellState.cellNumber);

        if (!shouldBeSelected || cellState.isSelected) return cellState;

        const nextCellState = {
          ...cellState,
          isSelected: true,
        };

        return nextCellState;
      },
    );

    const didBoardStateChange = previousBoardState.some(
      (cellState, cellIndex) =>
        cellState !== boardStateWithUpdatedSelections[cellIndex],
    );

    if (!didBoardStateChange) return previousPuzzleHistory;

    const nextBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (boardState, boardStateIndex) =>
        boardStateIndex === previousPuzzleHistory.currentBoardStateIndex
          ? boardStateWithUpdatedSelections
          : boardState,
    );

    const nextPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
  });

const getCellNumbersBetweenBoardPositions = (
  endingBoardPosition: BoardPosition,
  startingBoardPosition: BoardPosition,
): Array<CellNumber> => {
  const columnDistance =
    endingBoardPosition.columnNumber - startingBoardPosition.columnNumber;
  const rowDistance =
    endingBoardPosition.rowNumber - startingBoardPosition.rowNumber;

  const interpolationStepCount = Math.max(
    Math.abs(rowDistance),
    Math.abs(columnDistance),
  );

  if (interpolationStepCount === 0) return [startingBoardPosition.cellNumber];

  const crossedCellNumbers = new Set<CellNumber>();

  for (
    let interpolationStepIndex = 0;
    interpolationStepIndex <= interpolationStepCount;
    interpolationStepIndex++
  ) {
    const interpolationProgress =
      interpolationStepIndex / interpolationStepCount;

    const interpolatedColumnNumber = Math.round(
      startingBoardPosition.columnNumber +
        columnDistance * interpolationProgress,
    );
    const interpolatedRowNumber = Math.round(
      startingBoardPosition.rowNumber + rowDistance * interpolationProgress,
    );
    const interpolatedCellNumber =
      (interpolatedRowNumber - 1) * 9 + interpolatedColumnNumber;

    if (isCellNumber(interpolatedCellNumber))
      crossedCellNumbers.add(interpolatedCellNumber);
  }

  return [...crossedCellNumbers];
};

const handleBoardPointerMove = (
  boardRef: RefObject<HTMLDivElement | null>,
  event: PointerEvent<HTMLDivElement>,
  isPointerDraggingAcrossBoardRef: RefObject<boolean>,
  lastSelectedCellNumberRef: RefObject<CellNumber | undefined>,
  previousBoardPositionDuringDragRef: RefObject<BoardPosition | undefined>,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  if (!isPointerDraggingAcrossBoardRef.current) return;

  const boardElement = boardRef.current;

  if (boardElement === null) return;

  const currentBoardPosition = getBoardPositionFromPointerCoordinates(
    boardElement,
    event.clientX,
    event.clientY,
  );

  if (currentBoardPosition === undefined) return;

  const previousBoardPosition = previousBoardPositionDuringDragRef.current;

  if (
    previousBoardPosition !== undefined &&
    currentBoardPosition.cellNumber === previousBoardPosition.cellNumber
  )
    return;

  if (previousBoardPosition === undefined) {
    previousBoardPositionDuringDragRef.current = currentBoardPosition;
    lastSelectedCellNumberRef.current = currentBoardPosition.cellNumber;

    handleMultiCellSelectionDuringPointerDrag(
      [currentBoardPosition.cellNumber],
      setPuzzleHistory,
    );

    return;
  }

  const cellNumbersCrossedBetweenPositions =
    getCellNumbersBetweenBoardPositions(
      currentBoardPosition,
      previousBoardPosition,
    );

  handleMultiCellSelectionDuringPointerDrag(
    cellNumbersCrossedBetweenPositions,
    setPuzzleHistory,
  );

  lastSelectedCellNumberRef.current = currentBoardPosition.cellNumber;

  previousBoardPositionDuringDragRef.current = currentBoardPosition;
};

const getCellStateWithUpdatedSelections = (
  isMultiselectMode: boolean,
  previousCellState: CellState,
  selectedCellNumberWhenExactlyOneIsSelected: CellNumber | undefined,
  selectedCellsCount: number,
  targetCellNumber: CellNumber,
): CellState => {
  if (isMultiselectMode) {
    const isTargetCell = previousCellState.cellNumber === targetCellNumber;

    const nextCellState = isTargetCell
      ? {
          ...previousCellState,
          isSelected: !previousCellState.isSelected,
        }
      : previousCellState;

    return nextCellState;
  }

  const isThisTheOnlySelectedCell =
    selectedCellsCount === 1 &&
    selectedCellNumberWhenExactlyOneIsSelected === targetCellNumber;

  const shouldBeSelected =
    previousCellState.cellNumber === targetCellNumber
      ? !isThisTheOnlySelectedCell
      : false;

  const nextCellState =
    shouldBeSelected === previousCellState.isSelected
      ? previousCellState
      : {
          ...previousCellState,
          isSelected: shouldBeSelected,
        };

  return nextCellState;
};

const handleCellSelection = (
  isMultiselectMode: boolean,
  targetCellNumber: CellNumber,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const selectedCellsCount = previousBoardState.reduce(
      (selectedCount, cellState) =>
        cellState.isSelected ? selectedCount + 1 : selectedCount,
      0,
    );

    const selectedCellNumberWhenExactlyOneIsSelected =
      selectedCellsCount === 1
        ? previousBoardState.find((cellState) => cellState.isSelected)
            ?.cellNumber
        : undefined;

    const boardStateWithUpdatedSelections = previousBoardState.map(
      (cellState) =>
        getCellStateWithUpdatedSelections(
          isMultiselectMode,
          cellState,
          selectedCellNumberWhenExactlyOneIsSelected,
          selectedCellsCount,
          targetCellNumber,
        ),
    );

    const didBoardStateChange = previousBoardState.some(
      (cellState, cellIndex) =>
        cellState !== boardStateWithUpdatedSelections[cellIndex],
    );

    if (!didBoardStateChange) return previousPuzzleHistory;

    const nextBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (boardState, boardStateIndex) =>
        boardStateIndex === previousPuzzleHistory.currentBoardStateIndex
          ? boardStateWithUpdatedSelections
          : boardState,
    );

    const nextPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
  });

const handleCellPointerDown = (
  boardRef: RefObject<HTMLDivElement | null>,
  isMultiselectMode: boolean,
  isPointerDraggingAcrossBoardRef: RefObject<boolean>,
  lastSelectedCellNumberRef: RefObject<CellNumber | undefined>,
  previousBoardPositionDuringDragRef: RefObject<BoardPosition | undefined>,
  targetCellNumber: CellNumber,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  isPointerDraggingAcrossBoardRef.current = true;

  const boardElement = boardRef.current;

  if (boardElement !== null) {
    const zeroBasedCellNumber = targetCellNumber - 1;
    const columnNumber = (zeroBasedCellNumber % 9) + 1;
    const rowNumber = Math.floor(zeroBasedCellNumber / 9) + 1;

    if (isColumnNumber(columnNumber) && isRowNumber(rowNumber))
      previousBoardPositionDuringDragRef.current = {
        cellNumber: targetCellNumber,
        columnNumber,
        rowNumber,
      };
    else
      throw Error(
        `An invalid columnNumber "${columnNumber}" or rowNumber "${rowNumber}" was encountered during a pointer down event.`,
      );
  } else previousBoardPositionDuringDragRef.current = undefined;

  lastSelectedCellNumberRef.current = targetCellNumber;

  handleCellSelection(isMultiselectMode, targetCellNumber, setPuzzleHistory);
};
// #endregion

type BoardProps = {
  isMultiselectMode: boolean;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const Board = ({
  isMultiselectMode,
  puzzleHistory,
  setPuzzleHistory,
}: BoardProps) => {
  const { userSettings } = useUserSettings();

  const boardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const conflictedCellNumbers = userSettings.isConflictCheckerEnabled
    ? getConflictedCellNumbers(boardState)
    : new Set<CellNumber>();

  const selectedCells = boardState.filter((cellState) => cellState.isSelected);

  const shouldShowSeenCells =
    userSettings.isShowSeenCellsEnabled && selectedCells.length === 1;

  const selectedColumnNumber =
    selectedCells.length === 1 ? selectedCells[0].columnNumber : undefined;
  const selectedRowNumber =
    selectedCells.length === 1 ? selectedCells[0].rowNumber : undefined;

  const boardRef = useRef<HTMLDivElement | null>(null);
  const isPointerDraggingAcrossBoardRef = useRef(false);
  const previousBoardPositionDuringDragRef = useRef<BoardPosition | undefined>(
    undefined,
  );
  const lastSelectedCellNumberRef = useRef<CellNumber | undefined>(undefined);

  const handleBoardCellPointerDown = useCallback(
    (targetCellNumber: CellNumber) => {
      handleCellPointerDown(
        boardRef,
        isMultiselectMode,
        isPointerDraggingAcrossBoardRef,
        lastSelectedCellNumberRef,
        previousBoardPositionDuringDragRef,
        targetCellNumber,
        setPuzzleHistory,
      );
    },
    [isMultiselectMode, setPuzzleHistory],
  );

  useEffect(() => {
    const handleAddToOrMoveCellSelection = (
      arrowKeyDirection: ArrowKeyDirection,
      event: KeyboardEvent,
    ) => {
      if (event.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD) return;

      if (event.ctrlKey || event.shiftKey) {
        event.preventDefault();

        handleAddToCellSelectionInDirection(
          arrowKeyDirection,
          lastSelectedCellNumberRef.current,
          (cellNumber) => (lastSelectedCellNumberRef.current = cellNumber),
          setPuzzleHistory,
        );

        return;
      }

      event.preventDefault();

      handleMoveSingleCellSelectionInDirection(
        arrowKeyDirection,
        lastSelectedCellNumberRef.current,
        (cellNumber) => (lastSelectedCellNumberRef.current = cellNumber),
        setPuzzleHistory,
      );

      return;
    };

    const handleCellSelectionShortcut = (
      event: KeyboardEvent,
      keyboardKey: string,
    ) => {
      const lowerCaseKey = keyboardKey.toLowerCase();

      if (lowerCaseKey === "a" && event.shiftKey) {
        event.preventDefault();
        handleDeselectAllCells(setPuzzleHistory);
        return;
      }

      if (lowerCaseKey === "a") {
        event.preventDefault();
        handleSelectAllCells(setPuzzleHistory);
        return;
      }

      if (lowerCaseKey === "i") {
        event.preventDefault();
        handleInvertSelectedCells(setPuzzleHistory);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyboardKey = event.key;

      if (isArrowKeyDirection(keyboardKey))
        handleAddToOrMoveCellSelection(keyboardKey, event);

      if (!event.ctrlKey || event.metaKey) return;

      handleCellSelectionShortcut(event, keyboardKey);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setPuzzleHistory]);

  return (
    <SimpleGrid
      border="2px solid black"
      columns={9}
      gap="0"
      minWidth={{
        base: "301px",
        sm: "463px",
        md: "724px",
      }}
      ref={boardRef}
      touchAction="none"
      onLostPointerCapture={() =>
        handleBoardPointerUpOrCancel(
          isPointerDraggingAcrossBoardRef,
          previousBoardPositionDuringDragRef,
        )
      }
      onPointerCancel={() =>
        handleBoardPointerUpOrCancel(
          isPointerDraggingAcrossBoardRef,
          previousBoardPositionDuringDragRef,
        )
      }
      onPointerMove={(event) =>
        handleBoardPointerMove(
          boardRef,
          event,
          isPointerDraggingAcrossBoardRef,
          lastSelectedCellNumberRef,
          previousBoardPositionDuringDragRef,
          setPuzzleHistory,
        )
      }
      onPointerUp={() =>
        handleBoardPointerUpOrCancel(
          isPointerDraggingAcrossBoardRef,
          previousBoardPositionDuringDragRef,
        )
      }
    >
      {boardState.map((cellState) => (
        <Cell
          boardState={boardState}
          cellState={cellState}
          handleCellPointerDown={handleBoardCellPointerDown}
          hasDigitConflict={conflictedCellNumbers.has(cellState.cellNumber)}
          isSeenInBox={
            shouldShowSeenCells &&
            selectedCells[0].boxNumber === cellState.boxNumber
          }
          isSeenInColumn={
            shouldShowSeenCells &&
            selectedCells[0].columnNumber === cellState.columnNumber
          }
          isSeenInRow={
            shouldShowSeenCells &&
            selectedCells[0].rowNumber === cellState.rowNumber
          }
          key={cellState.cellNumber}
          selectedColumnNumber={selectedColumnNumber}
          selectedRowNumber={selectedRowNumber}
          setPuzzleHistory={setPuzzleHistory}
        />
      ))}
    </SimpleGrid>
  );
};
