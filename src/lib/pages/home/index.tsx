import { Button, Flex, HStack, SimpleGrid, Square } from "@chakra-ui/react";

const SudokuCell = (cellValue: string) => {
  return (
    <Square
      aspectRatio="square"
      border="1px solid black"
      minHeight={{ base: "31px", sm: "51px", md: "80px" }}
      minWidth={{ base: "31px", sm: "51px", md: "80px" }}
    >
      <Button
        backgroundColor="transparent"
        borderRadius="0"
        borderWidth="0"
        padding="0"
        color="black"
        height="stretch"
        minHeight={{ base: "31px", sm: "51px", md: "80px" }}
        minWidth={{ base: "31px", sm: "51px", md: "80px" }}
        textStyle={{
          base: "2xl",
          sm: "4xl",
          md: "6xl",
        }}
      >
        {cellValue}
      </Button>
    </Square>
  );
};

const SudokuBox = (
  <SimpleGrid
    border="2px solid black"
    columns={3}
    gap="0"
    minHeight={{ base: "103px", sm: "157px", md: "244px" }}
    minWidth={{ base: "103px", sm: "157px", md: "244px" }}
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
  <SimpleGrid
    border="2px solid black"
    columns={3}
    gap="0"
    minHeight={{ base: "313px", sm: "475px", md: "736px" }}
    minWidth={{ base: "313px", sm: "475px", md: "736px" }}
  >
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
        aspectRatio="square"
        backgroundColor="purple.fg"
        color="white"
        rounded="lg"
        size={{ base: "xs", sm: "md", md: "2xl" }}
        textStyle={{ base: "md", sm: "3xl", md: "5xl" }}
      >
        {buttonValue}
      </Button>
    </Square>
  );
};

const NumberPad = (
  <SimpleGrid columns={3} gap={{ base: "0.5", sm: "1", md: "1.5" }}>
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
