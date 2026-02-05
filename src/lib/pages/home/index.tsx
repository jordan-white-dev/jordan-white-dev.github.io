import { SimpleGrid, Square, Text } from "@chakra-ui/react";

const SudokuCell = (cellValue: string) => {
  return (
    <Square border="1px solid black">
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

// const NumberPad = (
//   <Grid templateColumns="repeat(3, 1fr)" >
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>1</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>2</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>3</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>4</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>5</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>6</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>7</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>8</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>9</Text>
//       </Square>
//     </GridItem>
//     <GridItem>
//       <Square backgroundColor="purple.fg" border="none" rounded="lg">
//         <Text>0</Text>
//       </Square>
//     </GridItem>
//   </Grid>
// );

const Home = () => {
  return (
    // <HStack>
    SudokuGrid
    // {/* {NumberPad} */}
    // </HStack>
  );
};

export default Home;
