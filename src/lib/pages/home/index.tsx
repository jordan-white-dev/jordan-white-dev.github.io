import { Button, Flex, HStack, SimpleGrid, Square } from "@chakra-ui/react";

const SudokuCell = (cellValue: string) => {
  return (
    <Square aspectRatio="square" border="1px solid black">
      <Button
        backgroundColor="white"
        borderRadius="0"
        color="black"
        height="stretch"
        textStyle="6xl"
      >
        {cellValue}
      </Button>
    </Square>
  );
};

const SudokuBox = (
  <SimpleGrid border="2px solid black" columns={3} gap="0">
    {SudokuCell("1")}
    {SudokuCell("2")}
    {SudokuCell("3")}
    {SudokuCell("4")}
    {SudokuCell("5")}
    {SudokuCell("6")}
    {SudokuCell("7")}
    {SudokuCell("8")}
    {SudokuCell("9")}
  </SimpleGrid>
);

const SudokuGrid = (
  <SimpleGrid border="2px solid black" columns={3} gap="0">
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
  </SimpleGrid>
);

const NumpadButton = (buttonValue: string) => {
  return (
    <Square aspectRatio="square" width="stretch">
      <Button
        backgroundColor="purple.fg"
        color="white"
        height="stretch"
        rounded="lg"
        textStyle="6xl"
      >
        {buttonValue}
      </Button>
    </Square>
  );
};

const NumberPad = (
  <SimpleGrid columns={3} gap="2">
    {NumpadButton("1")}
    {NumpadButton("2")}
    {NumpadButton("3")}
    {NumpadButton("4")}
    {NumpadButton("5")}
    {NumpadButton("6")}
    {NumpadButton("7")}
    {NumpadButton("8")}
    {NumpadButton("9")}
  </SimpleGrid>
);

const PlayerInterface = <HStack gap="8">{NumberPad}</HStack>;

const Home = () => {
  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap="8"
    >
      {SudokuGrid}
      {PlayerInterface}
    </Flex>
  );
};

export default Home;
