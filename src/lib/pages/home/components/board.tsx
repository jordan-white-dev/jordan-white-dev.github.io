import { SimpleGrid } from "@chakra-ui/react";
import type { Dispatch, PointerEvent, RefObject, SetStateAction } from "react";
import { useCallback, useRef } from "react";

import { useUserSettings } from "@/lib/pages/home/hooks/use-user-settings";
import { getStartingOrPlayerDigitInCellIfPresent } from "@/lib/pages/home/utils/constants";
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
} from "@/lib/pages/home/utils/types";

import { Cell } from "./cell";

// #region Cell Selection
const getCellStateWithUpdatedSelections = (
  targetCellNumber: CellNumber,
  isMultiselectMode: boolean,
  previousCellState: CellState,
  selectedCellsCount: number,
  selectedCellNumberWhenExactlyOneIsSelected: CellNumber | undefined,
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
          targetCellNumber,
          isMultiselectMode,
          cellState,
          selectedCellsCount,
          selectedCellNumberWhenExactlyOneIsSelected,
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
// #endregion

// #region Pointer Position To Board Position
type BoardPosition = {
  cellNumber: CellNumber;
  columnNumber: ColumnNumber;
  rowNumber: RowNumber;
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

  const cellWidth = boardBounds.width / 9;
  const cellHeight = boardBounds.height / 9;

  const zeroBasedColumnNumber = Math.min(
    8,
    Math.max(0, Math.floor((pointerClientX - boardBounds.left) / cellWidth)),
  );
  const zeroBasedRowNumber = Math.min(
    8,
    Math.max(0, Math.floor((pointerClientY - boardBounds.top) / cellHeight)),
  );

  const columnNumber = zeroBasedColumnNumber + 1;
  const rowNumber = zeroBasedRowNumber + 1;
  const cellNumber = zeroBasedRowNumber * 9 + zeroBasedColumnNumber + 1;

  if (
    isCellNumber(cellNumber) &&
    isColumnNumber(columnNumber) &&
    isRowNumber(rowNumber)
  ) {
    const boardPosition = {
      columnNumber,
      rowNumber,
      cellNumber,
    };

    return boardPosition;
  }

  throw Error(
    `Failed to get BoardPosition from pointer coordinates x: "${pointerClientX}" and y: "${pointerClientY}".`,
  );
};

const getCellNumbersBetweenBoardPositions = (
  startingBoardPosition: BoardPosition,
  endingBoardPosition: BoardPosition,
): Array<CellNumber> => {
  const rowDistance =
    endingBoardPosition.rowNumber - startingBoardPosition.rowNumber;
  const columnDistance =
    endingBoardPosition.columnNumber - startingBoardPosition.columnNumber;

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

    const interpolatedRowNumber = Math.round(
      startingBoardPosition.rowNumber + rowDistance * interpolationProgress,
    );
    const interpolatedColumnNumber = Math.round(
      startingBoardPosition.columnNumber +
        columnDistance * interpolationProgress,
    );
    const interpolatedCellNumber =
      (interpolatedRowNumber - 1) * 9 + interpolatedColumnNumber;

    if (isCellNumber(interpolatedCellNumber))
      crossedCellNumbers.add(interpolatedCellNumber);
  }

  return [...crossedCellNumbers];
};
// #endregion

// #region Pointer Drag Handling
const handleBoardPointerMove = (
  boardRef: RefObject<HTMLDivElement | null>,
  event: PointerEvent<HTMLDivElement>,
  isPointerDraggingAcrossBoardRef: RefObject<boolean>,
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

    handleMultiCellSelectionDuringPointerDrag(
      [currentBoardPosition.cellNumber],
      setPuzzleHistory,
    );

    return;
  }

  const cellNumbersCrossedBetweenPositions =
    getCellNumbersBetweenBoardPositions(
      previousBoardPosition,
      currentBoardPosition,
    );

  handleMultiCellSelectionDuringPointerDrag(
    cellNumbersCrossedBetweenPositions,
    setPuzzleHistory,
  );

  previousBoardPositionDuringDragRef.current = currentBoardPosition;
};

const handleBoardPointerUpOrCancel = (
  isPointerDraggingAcrossBoardRef: RefObject<boolean>,
  previousBoardPositionDuringDragRef: RefObject<BoardPosition | undefined>,
) => {
  isPointerDraggingAcrossBoardRef.current = false;
  previousBoardPositionDuringDragRef.current = undefined;
};

const handleCellPointerDown = (
  boardRef: RefObject<HTMLDivElement | null>,
  isPointerDraggingAcrossBoardRef: RefObject<boolean>,
  isMultiselectMode: boolean,
  previousBoardPositionDuringDragRef: RefObject<BoardPosition | undefined>,
  targetCellNumber: CellNumber,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  isPointerDraggingAcrossBoardRef.current = true;

  const boardElement = boardRef.current;

  if (boardElement !== null) {
    const zeroBasedCellNumber = targetCellNumber - 1;
    const rowNumber = Math.floor(zeroBasedCellNumber / 9) + 1;
    const columnNumber = (zeroBasedCellNumber % 9) + 1;

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

  handleCellSelection(isMultiselectMode, targetCellNumber, setPuzzleHistory);
};
// #endregion

// #region Conflict Checking
const addSudokuDigitOccurrenceToRegion = (
  digitOccurrencesByDigit: Map<SudokuDigit, Array<CellNumber>>,
  sudokuDigit: SudokuDigit,
  cellNumber: CellNumber,
): void => {
  const matchingCellNumbers = digitOccurrencesByDigit.get(sudokuDigit) ?? [];
  matchingCellNumbers.push(cellNumber);
  digitOccurrencesByDigit.set(sudokuDigit, matchingCellNumbers);
};

const addConflictedCellNumbersFromRegion = (
  digitOccurrencesByDigit: Map<SudokuDigit, Array<CellNumber>>,
  conflictedCellNumbers: Set<CellNumber>,
): void => {
  for (const matchingCellNumbers of digitOccurrencesByDigit.values()) {
    if (matchingCellNumbers.length <= 1) continue;

    for (const cellNumber of matchingCellNumbers)
      conflictedCellNumbers.add(cellNumber);
  }
};

const addConflictedCellNumbersFromRegions = (
  digitOccurrencesByRegion: Array<Map<SudokuDigit, Array<CellNumber>>>,
  conflictedCellNumbers: Set<CellNumber>,
): void => {
  for (const digitOccurrencesByDigit of digitOccurrencesByRegion)
    addConflictedCellNumbersFromRegion(
      digitOccurrencesByDigit,
      conflictedCellNumbers,
    );
};

const getEmptyDigitOccurrencesByRegion = (): Array<
  Map<SudokuDigit, Array<CellNumber>>
> => Array.from({ length: 9 }, () => new Map());

const getConflictedCellNumbers = (boardState: BoardState): Set<CellNumber> => {
  const conflictedCellNumbers = new Set<CellNumber>();

  const sudokuDigitOccurrencesByRow = getEmptyDigitOccurrencesByRegion();
  const sudokuDigitOccurrencesByColumn = getEmptyDigitOccurrencesByRegion();
  const sudokuDigitOccurrencesByBox = getEmptyDigitOccurrencesByRegion();

  for (const cellState of boardState) {
    const sudokuDigit = getStartingOrPlayerDigitInCellIfPresent(
      cellState.cellContent,
    );
    if (sudokuDigit === "") continue;

    addSudokuDigitOccurrenceToRegion(
      sudokuDigitOccurrencesByRow[cellState.rowNumber - 1],
      sudokuDigit,
      cellState.cellNumber,
    );
    addSudokuDigitOccurrenceToRegion(
      sudokuDigitOccurrencesByColumn[cellState.columnNumber - 1],
      sudokuDigit,
      cellState.cellNumber,
    );
    addSudokuDigitOccurrenceToRegion(
      sudokuDigitOccurrencesByBox[cellState.boxNumber - 1],
      sudokuDigit,
      cellState.cellNumber,
    );
  }

  addConflictedCellNumbersFromRegions(
    sudokuDigitOccurrencesByRow,
    conflictedCellNumbers,
  );
  addConflictedCellNumbersFromRegions(
    sudokuDigitOccurrencesByColumn,
    conflictedCellNumbers,
  );
  addConflictedCellNumbersFromRegions(
    sudokuDigitOccurrencesByBox,
    conflictedCellNumbers,
  );

  return conflictedCellNumbers;
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

  const conflictedCellNumbers = userSettings.conflictChecker
    ? getConflictedCellNumbers(boardState)
    : new Set<CellNumber>();

  const selectedCells = boardState.filter((cellState) => cellState.isSelected);

  const shouldShowSeenCells =
    userSettings.showSeenCells && selectedCells.length === 1;

  const selectedColumnNumber =
    selectedCells.length === 1 ? selectedCells[0].columnNumber : undefined;

  const selectedRowNumber =
    selectedCells.length === 1 ? selectedCells[0].rowNumber : undefined;

  const boardRef = useRef<HTMLDivElement | null>(null);
  const isPointerDraggingAcrossBoardRef = useRef(false);
  const previousBoardPositionDuringDragRef = useRef<BoardPosition | undefined>(
    undefined,
  );

  const handleBoardCellPointerDown = useCallback(
    (targetCellNumber: CellNumber) => {
      handleCellPointerDown(
        boardRef,
        isPointerDraggingAcrossBoardRef,
        isMultiselectMode,
        previousBoardPositionDuringDragRef,
        targetCellNumber,
        setPuzzleHistory,
      );
    },
    [isMultiselectMode, setPuzzleHistory],
  );

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
