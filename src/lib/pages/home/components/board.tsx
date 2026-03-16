import { SimpleGrid } from "@chakra-ui/react";
import type { Dispatch, PointerEvent, RefObject, SetStateAction } from "react";
import { useRef } from "react";

import type { BoardState, PuzzleHistory } from "@/lib/shared/types";

import { Cell } from "./cell";

// #region Cell Selection & Pointer Movement
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

    if (!didBoardStateChange) {
      return previousPuzzleHistory;
    }

    const newPuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: previousPuzzleHistory.boardStateHistory.map(
        (previousBoardState, previousBoardStateIndex) =>
          previousBoardStateIndex ===
          previousPuzzleHistory.currentBoardStateIndex
            ? newBoardStateWithUpdatedCellSelections
            : previousBoardState,
      ),
    };

    return newPuzzleHistory;
  });
};

const getCellNumberUnderPointerFromCoordinates = (
  pointerClientX: number,
  pointerClientY: number,
): number | undefined => {
  const elementUnderPointer = document.elementFromPoint(
    pointerClientX,
    pointerClientY,
  );

  const closestCellElement = elementUnderPointer?.closest("[data-cell-number]");
  if (!(closestCellElement instanceof HTMLElement)) return undefined;

  const cellNumberAttribute = closestCellElement.dataset.cellNumber;
  if (cellNumberAttribute === undefined) return undefined;

  const cellNumber = Number(cellNumberAttribute);
  return Number.isNaN(cellNumber) ? undefined : cellNumber;
};

type PointerCoordinates = {
  pointerClientX: number;
  pointerClientY: number;
};

const processLatestPointerPositionDuringCurrentPointerDrag = (
  animationFrameRequestIdRef: RefObject<number | undefined>,
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef: RefObject<Set<number>>,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  latestPointerCoordinatesDuringCurrentPointerDragRef: RefObject<
    PointerCoordinates | undefined
  >,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  animationFrameRequestIdRef.current = undefined;

  if (!isPointerCurrentlyDraggingAcrossBoardRef.current) return;

  const latestPointerCoordinates =
    latestPointerCoordinatesDuringCurrentPointerDragRef.current;
  if (latestPointerCoordinates === undefined) return;

  const cellNumberUnderPointer = getCellNumberUnderPointerFromCoordinates(
    latestPointerCoordinates.pointerClientX,
    latestPointerCoordinates.pointerClientY,
  );
  if (cellNumberUnderPointer === undefined) return;

  const wasCellAlreadyHandledDuringCurrentPointerDrag =
    cellNumbersAlreadyHandledDuringCurrentPointerDragRef.current.has(
      cellNumberUnderPointer,
    );

  if (wasCellAlreadyHandledDuringCurrentPointerDrag) return;

  cellNumbersAlreadyHandledDuringCurrentPointerDragRef.current.add(
    cellNumberUnderPointer,
  );

  handleCellSelection(cellNumberUnderPointer, true, setPuzzleHistory);
};

const requestProcessingOfLatestPointerPositionDuringCurrentPointerDrag = (
  animationFrameRequestIdRef: RefObject<number | undefined>,
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef: RefObject<Set<number>>,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  latestPointerCoordinatesDuringCurrentPointerDragRef: RefObject<
    PointerCoordinates | undefined
  >,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const isAnimationFrameAlreadyScheduled =
    animationFrameRequestIdRef.current !== undefined;

  if (isAnimationFrameAlreadyScheduled) return;

  animationFrameRequestIdRef.current = window.requestAnimationFrame(() =>
    processLatestPointerPositionDuringCurrentPointerDrag(
      animationFrameRequestIdRef,
      cellNumbersAlreadyHandledDuringCurrentPointerDragRef,
      isPointerCurrentlyDraggingAcrossBoardRef,
      latestPointerCoordinatesDuringCurrentPointerDragRef,
      setPuzzleHistory,
    ),
  );
};

const handleBoardPointerMove = (
  animationFrameRequestIdRef: RefObject<number | undefined>,
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef: RefObject<Set<number>>,
  event: PointerEvent<HTMLDivElement>,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  latestPointerCoordinatesDuringCurrentPointerDragRef: RefObject<
    PointerCoordinates | undefined
  >,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  if (!isPointerCurrentlyDraggingAcrossBoardRef.current) return;

  latestPointerCoordinatesDuringCurrentPointerDragRef.current = {
    pointerClientX: event.clientX,
    pointerClientY: event.clientY,
  };

  requestProcessingOfLatestPointerPositionDuringCurrentPointerDrag(
    animationFrameRequestIdRef,
    cellNumbersAlreadyHandledDuringCurrentPointerDragRef,
    isPointerCurrentlyDraggingAcrossBoardRef,
    latestPointerCoordinatesDuringCurrentPointerDragRef,
    setPuzzleHistory,
  );
};

const handleBoardPointerUpOrCancel = (
  animationFrameRequestIdRef: RefObject<number | undefined>,
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef: RefObject<Set<number>>,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  latestPointerCoordinatesDuringCurrentPointerDragRef: RefObject<
    PointerCoordinates | undefined
  >,
) => {
  isPointerCurrentlyDraggingAcrossBoardRef.current = false;
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef.current.clear();
  latestPointerCoordinatesDuringCurrentPointerDragRef.current = undefined;

  if (animationFrameRequestIdRef.current !== undefined) {
    window.cancelAnimationFrame(animationFrameRequestIdRef.current);
    animationFrameRequestIdRef.current = undefined;
  }
};

const handleCellPointerDown = (
  cellNumber: number,
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef: RefObject<Set<number>>,
  isPointerCurrentlyDraggingAcrossBoardRef: RefObject<boolean>,
  isMultiselectMode: boolean,
  latestPointerCoordinatesDuringCurrentPointerDragRef: RefObject<
    PointerCoordinates | undefined
  >,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  isPointerCurrentlyDraggingAcrossBoardRef.current = true;
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef.current.clear();
  cellNumbersAlreadyHandledDuringCurrentPointerDragRef.current.add(cellNumber);
  latestPointerCoordinatesDuringCurrentPointerDragRef.current = undefined;

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

  const isPointerCurrentlyDraggingAcrossBoardRef = useRef(false);
  const cellNumbersAlreadyHandledDuringCurrentPointerDragRef = useRef<
    Set<number>
  >(new Set());
  const latestPointerCoordinatesDuringCurrentPointerDragRef = useRef<
    PointerCoordinates | undefined
  >(undefined);
  const animationFrameRequestIdRef = useRef<number | undefined>(undefined);

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
      onPointerCancel={() =>
        handleBoardPointerUpOrCancel(
          animationFrameRequestIdRef,
          cellNumbersAlreadyHandledDuringCurrentPointerDragRef,
          isPointerCurrentlyDraggingAcrossBoardRef,
          latestPointerCoordinatesDuringCurrentPointerDragRef,
        )
      }
      onPointerMove={(event) =>
        handleBoardPointerMove(
          animationFrameRequestIdRef,
          cellNumbersAlreadyHandledDuringCurrentPointerDragRef,
          event,
          isPointerCurrentlyDraggingAcrossBoardRef,
          latestPointerCoordinatesDuringCurrentPointerDragRef,
          setPuzzleHistory,
        )
      }
      onPointerUp={() =>
        handleBoardPointerUpOrCancel(
          animationFrameRequestIdRef,
          cellNumbersAlreadyHandledDuringCurrentPointerDragRef,
          isPointerCurrentlyDraggingAcrossBoardRef,
          latestPointerCoordinatesDuringCurrentPointerDragRef,
        )
      }
      touchAction="none"
    >
      {cellStates.map((cellState) => (
        <Cell
          cellState={cellState}
          key={cellState.cellNumber}
          handleCellPointerDown={(cellNumber) =>
            handleCellPointerDown(
              cellNumber,
              cellNumbersAlreadyHandledDuringCurrentPointerDragRef,
              isPointerCurrentlyDraggingAcrossBoardRef,
              isMultiselectMode,
              latestPointerCoordinatesDuringCurrentPointerDragRef,
              setPuzzleHistory,
            )
          }
          setPuzzleHistory={setPuzzleHistory}
        />
      ))}
    </SimpleGrid>
  );
};
