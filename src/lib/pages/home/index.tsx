import { Flex, Stack } from "@chakra-ui/react";

import { InputModes } from "./components/inputmodes";
import { InputPad } from "./components/inputpad";
import { PuzzleActions } from "./components/puzzleactions";
import { SudokuGrid } from "./components/sudokugrid";

const PlayerInterface = (
  <Stack
    alignItems="center"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    {PuzzleActions()}
    {InputPad()}
    {InputModes()}
  </Stack>
);

const Home = () => {
  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap={{ base: "4", md: "8" }}
    >
      {SudokuGrid}
      {PlayerInterface}
    </Flex>
  );
};

export default Home;
