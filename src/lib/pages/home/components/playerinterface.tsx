import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type {
  InputMode,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";

import { InputModeRadioCard } from "./inputmodes";
import { InputPad } from "./inputpad";
import { PuzzleActions } from "./puzzleactions";

type PlayerInterfaceProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
  isStayPausedMode: boolean;
  puzzleHistory: PuzzleHistory;
  startingRawBoardState: RawBoardState;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
};

export const PlayerInterface = ({
  inputMode,
  isMultiselectMode,
  isStayPausedMode,
  puzzleHistory,
  startingRawBoardState,
  setInputMode,
  setIsMultiselectMode,
  setPuzzleHistory,
  setStartingRawBoardState,
}: PlayerInterfaceProps) => (
  <Stack
    alignItems="center"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    <PuzzleActions
      isStayPausedMode={isStayPausedMode}
      puzzleHistory={puzzleHistory}
      startingRawBoardState={startingRawBoardState}
      setPuzzleHistory={setPuzzleHistory}
      setStartingRawBoardState={setStartingRawBoardState}
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
