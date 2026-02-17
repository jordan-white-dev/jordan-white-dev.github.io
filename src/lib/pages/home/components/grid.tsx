import { Button, SimpleGrid, Square } from "@chakra-ui/react";

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
        color="black"
        height={{ base: "31px", sm: "51px", md: "80px" }}
        padding="0"
        textStyle={{
          base: "2xl",
          sm: "4xl",
          md: "6xl",
        }}
        width={{ base: "31px", sm: "51px", md: "80px" }}
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
    height={{ base: "103px", sm: "157px", md: "244px" }}
    width={{ base: "103px", sm: "157px", md: "244px" }}
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

export const SudokuGrid = (
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
