import {
  Button,
  Flex,
  GridItem,
  Icon,
  IconButton,
  RadioCard,
  SimpleGrid,
  Square,
  Stack,
} from "@chakra-ui/react";
import { FiDelete } from "react-icons/fi";
import { GrMultiple } from "react-icons/gr";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";

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
        height="stretch"
        minHeight={{ base: "31px", sm: "51px", md: "80px" }}
        minWidth={{ base: "31px", sm: "51px", md: "80px" }}
        padding="0"
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
    <Square aspectRatio="square">
      <IconButton
        aspectRatio="square"
        backgroundColor="purple.fg"
        color="white"
        rounded="md"
        size={{ base: "xs", sm: "lg", md: "2xl" }}
        textStyle={{ base: "md", sm: "3xl", md: "5xl" }}
      >
        {buttonValue}
      </IconButton>
    </Square>
  );
};

const NumberPad = (
  <SimpleGrid
    height="fit-content"
    columns={3}
    gap={{ base: "0.1875rem", sm: "1", md: "1.5" }}
  >
    {NumpadButton("1")}
    {NumpadButton("2")}
    {NumpadButton("3")}
    {NumpadButton("4")}
    {NumpadButton("5")}
    {NumpadButton("6")}
    {NumpadButton("7")}
    {NumpadButton("8")}
    {NumpadButton("9")}
    <GridItem colSpan={3}>
      <IconButton
        aria-label="Delete"
        backgroundColor="purple.fg"
        color="white"
        rounded="md"
        size={{ base: "xs", sm: "lg", md: "2xl" }}
        textStyle={{ base: "md", sm: "3xl", md: "5xl" }}
        width="full"
      >
        <Icon size="2xl">
          <FiDelete />
        </Icon>
      </IconButton>
    </GridItem>
  </SimpleGrid>
);

const actions = [
  { value: "undo", label: "Undo", icon: <ImUndo /> },
  { value: "redo", label: "Redo", icon: <ImRedo /> },
  { value: "Submit", label: "Submit", icon: <ImCheckmark /> },
  { value: "multiselect", label: "Multiselect", icon: <GrMultiple /> },
];

const PuzzleActions = (
  <SimpleGrid
    columns={{ base: 1, lg: 2 }}
    gap={{ base: "0.5", sm: "1", md: "0.5833rem", lg: "3" }}
  >
    {actions.map((action) => (
      <IconButton
        aria-label={action.label}
        aspectRatio={2 / 1}
        key={action.value}
        rounded={{ base: "sm", sm: "md" }}
        size={{ sm: "xs", md: "lg", lg: "xl" }}
        paddingTop={{ base: "1px", sm: "0px" }}
        paddingBottom={{ base: "1px", sm: "0px" }}
      >
        <Icon size={{ base: "md", md: "xl" }}>{action.icon}</Icon>
      </IconButton>
    ))}
  </SimpleGrid>
);

const inputs = [
  { value: "digit", label: "Digit" },
  { value: "corner", label: "Corner" },
  { value: "center", label: "Center" },
  { value: "colors", label: "Colors" },
];

const InputActions = (
  <Stack direction={{ base: "column", lg: "row" }}>
    <RadioCard.Root
      align="center"
      defaultValue="digit"
      justify="center"
      orientation="horizontal"
      size="sm"
      maxWidth="sm"
    >
      <Stack align="stretch" direction={{ base: "column", lg: "row" }}>
        {inputs.map((input) => (
          <RadioCard.Item
            aria-label={input.label}
            key={input.value}
            value={input.value}
          >
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              {/* <Icon fontSize="2xl" color="fg.muted">
                {input.icon}
              </Icon> */}
              <RadioCard.ItemText>{input.label}</RadioCard.ItemText>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
  </Stack>
);

const PlayerInterface = (
  <Stack alignItems="center" direction={{ base: "row", lg: "column" }} gap="2">
    {PuzzleActions}
    {NumberPad}
    {InputActions}
  </Stack>
);

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
