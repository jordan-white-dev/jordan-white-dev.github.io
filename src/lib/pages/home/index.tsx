import { AspectRatio, Flex, SimpleGrid, Square, Text } from "@chakra-ui/react";

const SudokuCell = (cellValue: string) => {
  return (
    <Square aspectRatio="square" border="1px solid black">
      <Text>{cellValue}</Text>
    </Square>
  );
};

const SudokuBox = (
  <SimpleGrid
    aspectRatio="square"
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
  <SimpleGrid aspectRatio="square" border="2px solid black" columns={3} gap="0">
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

const NumberPad = (
  <SimpleGrid aspectRatio="square" columns={3} gap="2">
    <AspectRatio ratio={1 / 1}>
      <Square
        aspectRatio="square"
        backgroundColor="purple.fg"
        border="none"
        fontFamily="sans-serif"
        rounded="lg"
        textStyle="6xl"
      >
        <Text>1</Text>
      </Square>
    </AspectRatio>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>2</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>3</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>4</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>5</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>6</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>7</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>8</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>9</Text>
    </Square>
    <Square backgroundColor="purple.fg" border="none" rounded="lg">
      <Text>0</Text>
    </Square>
  </SimpleGrid>
);

const Home = () => {
  return (
    <Flex direction="row" gap="8">
      {SudokuGrid}
      {NumberPad}
    </Flex>
  );
};

export default Home;
