import { Flex } from "@chakra-ui/react";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";
import useSessionStorageState from "use-session-storage-state";

import type {
  BoardState,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/pages/home/utils/types";

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

    const newBoardStateWithClearedCellSelections: BoardState =
      previousBoardState.map((previousCellState) => {
        const updatedCellState = {
          ...previousCellState,
          isSelected: false,
        };

        return updatedCellState;
      });

    const newBoardStateHistory = [...previousPuzzleHistory.boardStateHistory];
    newBoardStateHistory[previousPuzzleHistory.currentBoardStateIndex] =
      newBoardStateWithClearedCellSelections;

    const newPuzzleHistory: PuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: newBoardStateHistory,
    };

    return newPuzzleHistory;
  });
};

type PuzzleProps = {
  rawBoardState: RawBoardState;
  startingBoardState: BoardState;
};

export const Puzzle = memo(
  ({ rawBoardState, startingBoardState }: PuzzleProps) => {
    const [isMultiselectMode, setIsMultiselectMode] =
      useSessionStorageState<boolean>("multiselect-mode", {
        defaultValue: false,
      });
    const [puzzleHistory, setPuzzleHistory] =
      useSessionStorageState<PuzzleHistory>(
        `puzzle-history-${JSON.stringify(rawBoardState)}`,
        {
          defaultValue: {
            currentBoardStateIndex: 0,
            boardStateHistory: [startingBoardState],
          },
        },
      );
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
    }, [setPuzzleHistory]);

    return (
      <Flex
        alignItems="center"
        direction={{ base: "column", lg: "row" }}
        fontFamily="sans-serif"
        gap={{ base: "4", md: "8" }}
        marginTop={{ sm: "2.5" }}
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
