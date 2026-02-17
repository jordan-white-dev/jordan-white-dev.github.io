import {
  Button,
  SimpleGrid,
  type SimpleGridProps,
  Square,
  type SquareProps,
} from "@chakra-ui/react";

const CELL_SIZE: SquareProps["minWidth"] = {
  base: "31px",
  sm: "51px",
  md: "80px",
};
const BOX_SIZE: SimpleGridProps["width"] = {
  base: "103px",
  sm: "157px",
  md: "244px",
};
const GRID_SIZE: SimpleGridProps["minWidth"] = {
  base: "313px",
  sm: "475px",
  md: "736px",
};
const THIN_BORDER: SquareProps["border"] = "1px solid black";
const THICK_BORDER: SquareProps["border"] = "2px solid black";

const SudokuCell = (cellValue: string) => {
  return (
    <Square
      aspectRatio="square"
      border={THIN_BORDER}
      minHeight={CELL_SIZE}
      minWidth={CELL_SIZE}
    >
      <Button
        backgroundColor="transparent"
        borderRadius="0"
        borderWidth="0"
        color="black"
        height={CELL_SIZE}
        padding="0"
        textStyle={{
          base: "2xl",
          sm: "4xl",
          md: "6xl",
        }}
        width={CELL_SIZE}
      >
        {cellValue}
      </Button>
    </Square>
  );
};

const SudokuBox = (
  <SimpleGrid
    border={THICK_BORDER}
    columns={3}
    gap="0"
    height={BOX_SIZE}
    width={BOX_SIZE}
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
    border={THICK_BORDER}
    columns={3}
    gap="0"
    minHeight={GRID_SIZE}
    minWidth={GRID_SIZE}
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
