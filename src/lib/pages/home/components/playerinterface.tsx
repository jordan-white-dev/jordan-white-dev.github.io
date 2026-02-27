import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { InputModeRadioCard } from "./inputmodes";
import { InputPad } from "./inputpad";
import type { InputMode, PuzzleHistory, RawBoardState } from "./puzzle";
import { PuzzleActions } from "./puzzleactions";

type PlayerInterfaceProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
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
