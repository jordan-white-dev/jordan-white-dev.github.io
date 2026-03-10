import { Flex } from "@chakra-ui/react";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  BoardState,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { Board } from "./board";
import { PlayerInterface } from "./player-interface";

const handleClearAllSelections = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const boardStateWithClearedCellSelections: BoardState =
      previousBoardState.map((previousCellState) => {
        const updatedCellState = {
          ...previousCellState,
          isSelected: false,
        };

        return updatedCellState;
      });

    const updatedBoardStateHistory =
      previousPuzzleHistory.boardStateHistory.map(
        (previousBoardState, index) =>
          index === previousPuzzleHistory.currentBoardStateIndex
            ? boardStateWithClearedCellSelections
            : previousBoardState,
      );

    const updatedPuzzleHistory: PuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: updatedBoardStateHistory,
    };

    return updatedPuzzleHistory;
  });
};

type PuzzleProps = {
  rawBoardState: RawBoardState;
  startingBoardState: BoardState;
};

export const Puzzle = memo(
  ({ rawBoardState, startingBoardState }: PuzzleProps) => {
    const [isMultiselectMode, setIsMultiselectMode] = useState(false);
    const [puzzleHistory, setPuzzleHistory] = useState<PuzzleHistory>({
      currentBoardStateIndex: 0,
      boardStateHistory: [startingBoardState],
    });
    const puzzleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handlePointerDownOutside = (event: PointerEvent) => {
        if (
          puzzleRef.current &&
          !puzzleRef.current.contains(event.target as Node)
        ) {
          handleClearAllSelections(setPuzzleHistory);
        }
      };

      document.addEventListener("pointerdown", handlePointerDownOutside);

      return () =>
        document.removeEventListener("pointerdown", handlePointerDownOutside);
    }, []);

    return (
      <Flex
        alignItems="center"
        direction={{ base: "column", lg: "row" }}
        fontFamily="sans-serif"
        gap={{ base: "4", md: "8" }}
        ref={puzzleRef}
      >
        <Board
          isMultiselectMode={isMultiselectMode}
          puzzleHistory={puzzleHistory}
          setPuzzleHistory={setPuzzleHistory}
        />
        <PlayerInterface
          isMultiselectMode={isMultiselectMode}
          puzzleHistory={puzzleHistory}
          rawBoardState={rawBoardState}
          setIsMultiselectMode={setIsMultiselectMode}
          setPuzzleHistory={setPuzzleHistory}
        />
      </Flex>
    );
  },
);
