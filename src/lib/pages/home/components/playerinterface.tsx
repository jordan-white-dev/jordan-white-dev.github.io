import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { InputMode } from "..";
import { InputModeRadioCard } from "./inputmodes";
import { InputPad } from "./inputpad";
import { PuzzleActions } from "./puzzleactions";

type PlayerInterfaceProps = {
  inputMode: InputMode;
  isInMultiselectMode: boolean;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
  setIsInMultiselectMode: Dispatch<SetStateAction<boolean>>;
};

export const PlayerInterface = ({
  inputMode,
  isInMultiselectMode,
  setInputMode,
  setIsInMultiselectMode,
}: PlayerInterfaceProps) => (
  <Stack
    alignItems="center"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    <PuzzleActions />
    <InputPad
      inputMode={inputMode}
      isInMultiselectMode={isInMultiselectMode}
      setIsInMultiselectMode={setIsInMultiselectMode}
    />
    <InputModeRadioCard inputMode={inputMode} setInputMode={setInputMode} />
  </Stack>
);
