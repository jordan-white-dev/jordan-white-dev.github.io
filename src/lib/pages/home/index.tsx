import { Flex, HStack, SimpleGrid, Square, Text } from "@chakra-ui/react";

const SudokuCell = (cellValue: string) => {
  return (
    <Square aspectRatio="square" border="1px solid black">
      <Text>{cellValue}</Text>
    </Square>
  );
};

const SudokuBox = (
  <SimpleGrid
    border="2px solid black"
    columns={3}
    fontFamily="sans-serif"
    gap="0"
    textStyle="6xl"
  >
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

const NumpadCell = (cellValue: string) => {
  return (
    <Square
      aspectRatio="square"
      backgroundColor="purple.fg"
      border="none"
      fontFamily="sans-serif"
      rounded="lg"
      textStyle="6xl"
      color="white"
      width="stretch"
    >
      <Text>{cellValue}</Text>
    </Square>
  );
};

const NumberPad = (
  <SimpleGrid
    columns={3}
    fontFamily="sans-serif"
    gap="2"
    textStyle="6xl"
    width="fit-content"
  >
    {NumpadCell("1")}
    {NumpadCell("2")}
    {NumpadCell("3")}
    {NumpadCell("4")}
    {NumpadCell("5")}
    {NumpadCell("6")}
    {NumpadCell("7")}
    {NumpadCell("8")}
    {NumpadCell("9")}
  </SimpleGrid>
);

const PlayerInterface = <HStack gap="8">{NumberPad}</HStack>;

const Home = () => {
  return (
    <Flex direction="column" alignItems="center" gap="8">
      {SudokuGrid}
      {PlayerInterface}
    </Flex>
  );
};

export default Home;
