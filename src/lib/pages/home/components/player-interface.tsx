import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import useSessionStorageState from "use-session-storage-state";

import type {
  KeypadMode,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { Keypad } from "./keypad";
import { KeypadModeRadioCard } from "./keypad-modes";
import { PuzzleActions } from "./puzzle-actions";

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
    "keypad-mode",
    {
      defaultValue: "Digit",
    },
  );

  return (
    <Stack
      alignItems="center"
      direction={{ base: "row", lg: "column" }}
      gap="4"
      minWidth={{ lg: "52" }}
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
