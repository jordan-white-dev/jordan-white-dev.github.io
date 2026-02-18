import { Flex, Stack } from "@chakra-ui/react";

import { SudokuGrid } from "./components/grid";
import { InputRadioCard } from "./components/input-radiocard";
import { NumberPad } from "./components/numberpad";
import { PuzzleActions } from "./components/puzzle-actions";

const PlayerInterface = (
  <Stack
    alignItems="start"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    {PuzzleActions()}
    {NumberPad()}
    {InputRadioCard()}
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
