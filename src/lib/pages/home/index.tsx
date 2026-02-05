import { Grid, GridItem, Square, Text } from "@chakra-ui/react";

const SudokuCell = (
  cellValue: string,
  isBorderTopSet: boolean,
  isBorderBottomSet: boolean,
  isBorderLeftSet: boolean,
  isBorderRightSet: boolean,
) => {
  return (
    <Square
      aspectRatio="square"
      borderTop={isBorderTopSet ? "3px solid black" : "none"}
      borderBottom={isBorderBottomSet ? "3px solid black" : "none"}
      borderLeft={isBorderLeftSet ? "3px solid black" : "none"}
      borderRight={isBorderRightSet ? "3px solid black" : "none"}
    >
      <Text>{cellValue}</Text>
    </Square>
  );
};

const SudokuBox = (
  <Grid
    aspectRatio="square"
    gap={0}
    templateColumns="repeat(3, 1fr)"
    divideColor="black"
    divideStyle="solid"
    divideX="3px"
    divideY="3px"
    textStyle="6xl"
    fontFamily="sans-serif"
    color="black"
  >
    <GridItem>{SudokuCell("1", true, false, true, false)}</GridItem>
    <GridItem>{SudokuCell("2", false, false, false, false)}</GridItem>
    <GridItem>{SudokuCell("3", false, false, false, true)}</GridItem>
    <GridItem>{SudokuCell("4", false, false, false, false)}</GridItem>
    <GridItem>{SudokuCell("5", false, false, false, false)}</GridItem>
    <GridItem>{SudokuCell("6", false, false, false, true)}</GridItem>
    <GridItem>{SudokuCell("7", false, true, false, false)}</GridItem>
    <GridItem>{SudokuCell("8", false, true, false, false)}</GridItem>
    <GridItem>{SudokuCell("9", false, true, false, true)}</GridItem>
  </Grid>
);

const SudokuGrid = (
  <Grid gap={0} templateColumns="repeat(3, 1fr)">
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
    <GridItem>{SudokuBox}</GridItem>
  </Grid>
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
