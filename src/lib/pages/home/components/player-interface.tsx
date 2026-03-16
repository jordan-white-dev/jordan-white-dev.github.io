import { Stack } from "@chakra-ui/react";
import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import useSessionStorageState from "use-session-storage-state";

import type {
  BoardState,
  KeypadMode,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { Keypad } from "./keypad";
import { KeypadModeRadioCard } from "./keypad-modes";
import { PuzzleActions } from "./puzzle-actions";

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

type PlayerInterfaceProps = {
  isMultiselectMode: boolean;
  puzzleHistory: PuzzleHistory;
  rawBoardState: RawBoardState;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const PlayerInterface = ({
  isMultiselectMode,
  puzzleHistory,
  rawBoardState,
  setIsMultiselectMode,
  setPuzzleHistory,
}: PlayerInterfaceProps) => {
  const [keypadMode, setKeypadMode] = useSessionStorageState<KeypadMode>(
    `keypad-mode-${JSON.stringify(rawBoardState)}`,
    {
      defaultValue: "Digit",
    },
  );

  const interfaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (
        interfaceRef.current &&
        !interfaceRef.current.contains(event.target as Node)
      ) {
        handleClearAllSelections(setPuzzleHistory);
      }
    };

    document.addEventListener("pointerdown", handlePointerDownOutside);

    return () =>
      document.removeEventListener("pointerdown", handlePointerDownOutside);
  }, [setPuzzleHistory]);

  return (
    <Stack
      alignItems="center"
      direction={{ base: "row", lg: "column" }}
      gap="4"
      minWidth={{ lg: "52" }}
      ref={interfaceRef}
    >
      <PuzzleActions
        puzzleHistory={puzzleHistory}
        rawBoardState={rawBoardState}
        setPuzzleHistory={setPuzzleHistory}
      />
      <Keypad
        isMultiselectMode={isMultiselectMode}
        keypadMode={keypadMode}
        puzzleHistory={puzzleHistory}
        setIsMultiselectMode={setIsMultiselectMode}
        setPuzzleHistory={setPuzzleHistory}
      />
      <KeypadModeRadioCard
        keypadMode={keypadMode}
        setKeypadMode={setKeypadMode}
      />
    </Stack>
  );
};
