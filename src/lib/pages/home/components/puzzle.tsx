import { Flex } from "@chakra-ui/react";
import {
  type Dispatch,
  memo,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";
import useSessionStorageState from "use-session-storage-state";

import { Board } from "@/lib/pages/home/components/board";
import { PlayerInterface } from "@/lib/pages/home/components/player-interface";
import {
  type BoardState,
  type PuzzleHistory,
  type RawBoardState,
} from "@/lib/pages/home/model/types";

const handleClearAllSelections = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const previousBoardState =
      previousPuzzleHistory.boardStateHistory[
        previousPuzzleHistory.currentBoardStateIndex
      ];

    const nextBoardStateWithClearedCellSelections: BoardState =
      previousBoardState.map((previousCellState) => {
        const nextCellState = {
          ...previousCellState,
          isSelected: false,
        };

        return nextCellState;
      });

    const nextBoardStateHistory = [...previousPuzzleHistory.boardStateHistory];
    nextBoardStateHistory[previousPuzzleHistory.currentBoardStateIndex] =
      nextBoardStateWithClearedCellSelections;

    const nextPuzzleHistory: PuzzleHistory = {
      currentBoardStateIndex: previousPuzzleHistory.currentBoardStateIndex,
      boardStateHistory: nextBoardStateHistory,
    };

    return nextPuzzleHistory;
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
        )
          handleClearAllSelections(setPuzzleHistory);
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
