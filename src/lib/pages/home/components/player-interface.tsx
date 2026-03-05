import { Stack } from "@chakra-ui/react";
import { type Dispatch, type SetStateAction, useState } from "react";

import type {
  InputMode,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { InputModeRadioCard } from "./input-modes";
import { InputPad } from "./input-pad";
import { PuzzleActions } from "./puzzle-actions";

type PlayerInterfaceProps = {
  isMultiselectMode: boolean;
  isStayPausedMode: boolean;
  puzzleHistory: PuzzleHistory;
  rawBoardState: RawBoardState;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const PlayerInterface = ({
  isMultiselectMode,
  isStayPausedMode,
  puzzleHistory,
  rawBoardState,
  setIsMultiselectMode,
  setPuzzleHistory,
}: PlayerInterfaceProps) => {
  const [inputMode, setInputMode] = useState<InputMode>("Digit");

  return (
    <Stack
      alignItems="center"
      direction={{ base: "row", lg: "column" }}
      gap="4"
      minWidth={{ lg: "52" }}
    >
      <PuzzleActions
        isStayPausedMode={isStayPausedMode}
        puzzleHistory={puzzleHistory}
        rawBoardState={rawBoardState}
        setPuzzleHistory={setPuzzleHistory}
      />
      <InputPad
        inputMode={inputMode}
        isMultiselectMode={isMultiselectMode}
        puzzleHistory={puzzleHistory}
        setIsMultiselectMode={setIsMultiselectMode}
        setPuzzleHistory={setPuzzleHistory}
      />
      <InputModeRadioCard inputMode={inputMode} setInputMode={setInputMode} />
    </Stack>
  );
};
