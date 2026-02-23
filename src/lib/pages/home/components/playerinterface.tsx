import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type {
  InputMode,
  PuzzleHistory,
  RawSudokuBoard,
  SudokuBoardState,
} from "..";
import { InputModeRadioCard } from "./inputmodes";
import { InputPad } from "./inputpad";
import { PuzzleActions } from "./puzzleactions";

type PlayerInterfaceProps = {
  initialRawSudokuBoard: RawSudokuBoard;
  inputMode: InputMode;
  isMultiselectMode: boolean;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const PlayerInterface = ({
  initialRawSudokuBoard,
  inputMode,
  isMultiselectMode,
  setCurrentSudokuBoard,
  setInputMode,
  setIsMultiselectMode,
  setPuzzleHistory,
}: PlayerInterfaceProps) => (
  <Stack
    alignItems="center"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    <PuzzleActions
      initialRawSudokuBoard={initialRawSudokuBoard}
      setCurrentSudokuBoard={setCurrentSudokuBoard}
      setPuzzleHistory={setPuzzleHistory}
    />
    <InputPad
      inputMode={inputMode}
      isMultiselectMode={isMultiselectMode}
      setIsMultiselectMode={setIsMultiselectMode}
    />
    <InputModeRadioCard inputMode={inputMode} setInputMode={setInputMode} />
  </Stack>
);
