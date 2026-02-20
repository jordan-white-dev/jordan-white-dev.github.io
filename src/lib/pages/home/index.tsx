import { Flex, Stack } from "@chakra-ui/react";
import { type Dispatch, type SetStateAction, useState } from "react";

import { InputModes } from "./components/inputmodes";
import { InputPad } from "./components/inputpad";
import { PuzzleActions } from "./components/puzzleactions";
import { SudokuGrid } from "./components/sudokugrid";

type PlayerInterfaceProps = {
  inputMode: InputMode;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
};

const PlayerInterface = ({ inputMode, setInputMode }: PlayerInterfaceProps) => (
  <Stack
    alignItems="center"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    <PuzzleActions />
    <InputPad inputMode={inputMode} />
    <InputModes inputMode={inputMode} setInputMode={setInputMode} />
  </Stack>
);

export const inputModes = ["Digit", "Color", "Center", "Corner"] as const;
export type InputMode = (typeof inputModes)[number];

const Home = () => {
  const [inputMode, setInputMode] = useState<InputMode>("Digit");

  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap={{ base: "4", md: "8" }}
    >
      <SudokuGrid />
      <PlayerInterface inputMode={inputMode} setInputMode={setInputMode} />
    </Flex>
  );
};

export default Home;
