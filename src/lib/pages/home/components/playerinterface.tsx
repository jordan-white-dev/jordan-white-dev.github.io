import { Stack } from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { InputMode } from "..";
import { InputModes } from "./inputmodes";
import { InputPad } from "./inputpad";
import { PuzzleActions } from "./puzzleactions";

type PlayerInterfaceProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
};

export const PlayerInterface = ({
  inputMode,
  isMultiselectMode,
  setInputMode,
  setIsMultiselectMode,
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
      isMultiselectMode={isMultiselectMode}
      setIsMultiselectMode={setIsMultiselectMode}
    />
    <InputModes inputMode={inputMode} setInputMode={setInputMode} />
  </Stack>
);
