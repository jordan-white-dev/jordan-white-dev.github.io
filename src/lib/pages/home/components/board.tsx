import { SimpleGrid } from "@chakra-ui/react";
import type {
  Dispatch,
  PointerEvent as ReactPointerEvent,
  RefObject,
  SetStateAction,
} from "react";
import { useCallback, useRef } from "react";

import type { BoardState, PuzzleHistory } from "@/lib/shared/types";

import { Cell } from "./cell";

// #region Cell Selection
const getNewCellStateWithUpdatedCellSelections = (
  cellNumber: number,
  isMultiselectMode: boolean,
  previousCellState: BoardState[number],
  selectedCellCount: number,
  selectedCellNumberWhenOnlyOneCellIsSelected: number | undefined,
): BoardState[number] => {
  if (isMultiselectMode) {
    const isSelectedCell = previousCellState.cellNumber === cellNumber;

    const newCellState = isSelectedCell
      ? {
          ...previousCellState,
          isSelected: !previousCellState.isSelected,
        }
      : previousCellState;

    return newCellState;
  }

  const isThisTheOnlySelectedCell =
    selectedCellCount === 1 &&
    selectedCellNumberWhenOnlyOneCellIsSelected === cellNumber;

  const isSelectedCell =
    previousCellState.cellNumber === cellNumber
      ? !isThisTheOnlySelectedCell
      : false;

  const newCellState =
    isSelectedCell === previousCellState.isSelected
      ? previousCellState
      : {
          ...previousCellState,
          isSelected: isSelectedCell,
        };

  return newCellState;
};

const handleCellSelection = (
  cellNumber: number,
  isMultiselectMode: boolean,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const selectedCellCount = previousBoardState.reduce(
      (count, previousCellState) =>
        previousCellState.isSelected ? count + 1 : count,
      0,
    );

    const selectedCellNumberWhenOnlyOneCellIsSelected =
      selectedCellCount === 1
        ? previousBoardState.find(
            (previousCellState) => previousCellState.isSelected,
          )?.cellNumber
        : undefined;

    const newBoardStateWithUpdatedCellSelections = previousBoardState.map(
      (previousCellState) =>
        getNewCellStateWithUpdatedCellSelections(
          cellNumber,
          isMultiselectMode,
          previousCellState,
          selectedCellCount,
          selectedCellNumberWhenOnlyOneCellIsSelected,
        ),
    );

    const didBoardStateChange = previousBoardState.some(
      (previousCellState, cellIndex) =>
        previousCellState !== newBoardStateWithUpdatedCellSelections[cellIndex],
    );

    if (!didBoardStateChange) return previousPuzzleHistory;

    const newBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (previousBoardState, previousBoardStateIndex) =>
        previousBoardStateIndex === previousPuzzleHistory.currentBoardStateIndex
          ? newBoardStateWithUpdatedCellSelections
          : previousBoardState,
    );

    const newPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: newBoardStateHistory,
    };

    return newPuzzleHistory;
  });
};

const handleMultiCellSelectionDuringPointerDrag = (
  cellNumbersToSelect: Array<number>,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const cellNumbersToSelectSet = new Set(cellNumbersToSelect);

    const newBoardStateWithUpdatedCellSelections = previousBoardState.map(
      (previousCellState) => {
        const shouldSelectCell = cellNumbersToSelectSet.has(
          previousCellState.cellNumber,
        );

        if (!shouldSelectCell || previousCellState.isSelected)
          return previousCellState;

        const newCellState = {
          ...previousCellState,
          isSelected: true,
        };

        return newCellState;
      },
    );

    const didBoardStateChange = previousBoardState.some(
      (previousCellState, cellIndex) =>
        previousCellState !== newBoardStateWithUpdatedCellSelections[cellIndex],
    );

    if (!didBoardStateChange) return previousPuzzleHistory;

    const newBoardStateHistory = previousPuzzleHistory.boardStateHistory.map(
      (previousBoardState, previousBoardStateIndex) =>
        previousBoardStateIndex === previousPuzzleHistory.currentBoardStateIndex
          ? newBoardStateWithUpdatedCellSelections
          : previousBoardState,
    );

    const newPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: newBoardStateHistory,
    };

    return newPuzzleHistory;
  });
};
// #endregion

// #region Pointer Position To Board Position
type BoardPosition = {
  cellNumber: number;
  columnNumber: number;
  rowNumber: number;
};

const getBoardPositionFromPointerCoordinates = (
  boardElement: HTMLDivElement,
  pointerClientX: number,
  pointerClientY: number,
): BoardPosition | undefined => {
  const boardBoundingClientRect = boardElement.getBoundingClientRect();

  const isPointerOutsideBoardHorizontally =
    pointerClientX < boardBoundingClientRect.left ||
    pointerClientX > boardBoundingClientRect.right;
  const isPointerOutsideBoardVertically =
    pointerClientY < boardBoundingClientRect.top ||
    pointerClientY > boardBoundingClientRect.bottom;

  if (isPointerOutsideBoardHorizontally || isPointerOutsideBoardVertically)
    return undefined;

  const cellWidth = boardBoundingClientRect.width / 9;
  const cellHeight = boardBoundingClientRect.height / 9;

  const zeroBasedColumnNumber = Math.min(
    8,
    Math.max(
      0,
      Math.floor((pointerClientX - boardBoundingClientRect.left) / cellWidth),
    ),
  );
  const zeroBasedRowNumber = Math.min(
    8,
    Math.max(
      0,
      Math.floor((pointerClientY - boardBoundingClientRect.top) / cellHeight),
    ),
  );

  const columnNumber = zeroBasedColumnNumber + 1;
  const rowNumber = zeroBasedRowNumber + 1;
  const cellNumber = zeroBasedRowNumber * 9 + zeroBasedColumnNumber + 1;

  const boardPosition = {
    columnNumber,
    rowNumber,
    cellNumber,
  };

  return boardPosition;
};

const getCellNumbersBetweenBoardPositions = (
  startingBoardPosition: BoardPosition,
  endingBoardPosition: BoardPosition,
): Array<number> => {
  const rowDistance =
    endingBoardPosition.rowNumber - startingBoardPosition.rowNumber;
  const columnDistance =
    endingBoardPosition.columnNumber - startingBoardPosition.columnNumber;

  const interpolationStepCount = Math.max(
    Math.abs(rowDistance),
    Math.abs(columnDistance),
  );

  if (interpolationStepCount === 0) return [startingBoardPosition.cellNumber];

  const crossedCellNumbers = new Set<number>();

  for (
    let interpolationStep = 0;
    interpolationStep <= interpolationStepCount;
    interpolationStep++
  ) {
    const interpolationProgress = interpolationStep / interpolationStepCount;

    const interpolatedRowNumber = Math.round(
      startingBoardPosition.rowNumber + rowDistance * interpolationProgress,
    );
    const interpolatedColumnNumber = Math.round(
      startingBoardPosition.columnNumber +
        columnDistance * interpolationProgress,
    );
    const interpolatedCellNumber =
      (interpolatedRowNumber - 1) * 9 + interpolatedColumnNumber;

    crossedCellNumbers.add(interpolatedCellNumber);
  }

  return [...crossedCellNumbers];
};
// #endregion

// #region Pointer Drag Handling
const handleBoardPointerMove = (
  boardRef: RefObject<HTMLDivElement | null>,
  event: ReactPointerEvent<HTMLDivElement>,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  previousBoardPositionDuringCurrentPointerDragRef: RefObject<
    BoardPosition | undefined
  >,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  if (!isPointerCurrentlyDraggingAcrossBoardRef.current) return;

  const boardElement = boardRef.current;
  if (boardElement === null) return;

  const currentBoardPosition = getBoardPositionFromPointerCoordinates(
    boardElement,
    event.clientX,
    event.clientY,
  );
  if (currentBoardPosition === undefined) return;

  const previousBoardPosition =
    previousBoardPositionDuringCurrentPointerDragRef.current;

  if (previousBoardPosition === undefined) {
    previousBoardPositionDuringCurrentPointerDragRef.current =
      currentBoardPosition;

    handleMultiCellSelectionDuringPointerDrag(
      [currentBoardPosition.cellNumber],
      setPuzzleHistory,
    );

    return;
  }

  const cellNumbersBetweenPreviousAndCurrentBoardPositions =
    getCellNumbersBetweenBoardPositions(
      previousBoardPosition,
      currentBoardPosition,
    );

  handleMultiCellSelectionDuringPointerDrag(
    cellNumbersBetweenPreviousAndCurrentBoardPositions,
    setPuzzleHistory,
  );

  previousBoardPositionDuringCurrentPointerDragRef.current =
    currentBoardPosition;
};

const handleBoardPointerUpOrCancel = (
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  previousBoardPositionDuringCurrentPointerDragRef: RefObject<
    BoardPosition | undefined
  >,
) => {
  isPointerCurrentlyDraggingAcrossBoardRef.current = false;
  previousBoardPositionDuringCurrentPointerDragRef.current = undefined;
};

const handleCellPointerDown = (
  boardRef: RefObject<HTMLDivElement | null>,
  cellNumber: number,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  isMultiselectMode: boolean,
  previousBoardPositionDuringCurrentPointerDragRef: RefObject<
    BoardPosition | undefined
  >,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  isPointerCurrentlyDraggingAcrossBoardRef.current = true;

  const boardElement = boardRef.current;

  if (boardElement !== null) {
    const zeroBasedCellNumber = cellNumber - 1;
    const rowNumber = Math.floor(zeroBasedCellNumber / 9) + 1;
    const columnNumber = (zeroBasedCellNumber % 9) + 1;

    previousBoardPositionDuringCurrentPointerDragRef.current = {
      cellNumber,
      columnNumber,
      rowNumber,
    };
  } else previousBoardPositionDuringCurrentPointerDragRef.current = undefined;

  handleCellSelection(cellNumber, isMultiselectMode, setPuzzleHistory);
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
  const cellStates =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const boardRef = useRef<HTMLDivElement | null>(null);
  const isPointerCurrentlyDraggingAcrossBoardRef = useRef(false);
  const previousBoardPositionDuringCurrentPointerDragRef = useRef<
    BoardPosition | undefined
  >(undefined);

  const handleBoardCellPointerDown = useCallback(
    (cellNumber: number) => {
      handleCellPointerDown(
        boardRef,
        cellNumber,
        isPointerCurrentlyDraggingAcrossBoardRef,
        isMultiselectMode,
        previousBoardPositionDuringCurrentPointerDragRef,
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
          isPointerCurrentlyDraggingAcrossBoardRef,
          previousBoardPositionDuringCurrentPointerDragRef,
        )
      }
      onPointerCancel={() =>
        handleBoardPointerUpOrCancel(
          isPointerCurrentlyDraggingAcrossBoardRef,
          previousBoardPositionDuringCurrentPointerDragRef,
        )
      }
      onPointerMove={(event) =>
        handleBoardPointerMove(
          boardRef,
          event,
          isPointerCurrentlyDraggingAcrossBoardRef,
          previousBoardPositionDuringCurrentPointerDragRef,
          setPuzzleHistory,
        )
      }
      onPointerUp={() =>
        handleBoardPointerUpOrCancel(
          isPointerCurrentlyDraggingAcrossBoardRef,
          previousBoardPositionDuringCurrentPointerDragRef,
        )
      }
    >
      {cellStates.map((cellState) => (
        <Cell
          cellState={cellState}
          handleCellPointerDown={handleBoardCellPointerDown}
          key={cellState.cellNumber}
          setPuzzleHistory={setPuzzleHistory}
        />
      ))}
    </SimpleGrid>
  );
};
