import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import { InputModeRadioCard } from "./inputmodes";
import { InputPad } from "./inputpad";
import type { InputMode, PuzzleHistory, RawBoardState } from "./puzzle";
import { PuzzleActions } from "./puzzleactions";

type PlayerInterfaceProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
  isStayPausedMode: boolean;
  puzzleHistory: PuzzleHistory;
  startingRawBoardState: RawBoardState;
  stopwatchTime: string;
  pause: () => void;
  reset: () => void;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
  start: () => void;
};

export const PlayerInterface = ({
  inputMode,
  isMultiselectMode,
  isStayPausedMode,
  puzzleHistory,
  startingRawBoardState,
  stopwatchTime,
  pause,
  reset,
  setInputMode,
  setIsMultiselectMode,
  setPuzzleHistory,
  setStartingRawBoardState,
  start,
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
      stopwatchTime={stopwatchTime}
      pause={pause}
      reset={reset}
      setPuzzleHistory={setPuzzleHistory}
      setStartingRawBoardState={setStartingRawBoardState}
      start={start}
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
