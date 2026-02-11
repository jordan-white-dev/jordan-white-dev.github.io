import {
  Button,
  Flex,
  Icon,
  RadioCard,
  SimpleGrid,
  Square,
  Stack,
} from "@chakra-ui/react";
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
  <SimpleGrid
    columns={3}
    gap={{ base: "0.5", sm: "1", md: "1.5" }}
    height="fit-content"
    width="fit-content"
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
  </SimpleGrid>
);

const actions = [
  { value: "undo", icon: <ImUndo /> },
  { value: "redo", icon: <ImRedo /> },
  { value: "check", icon: <ImCheckmark /> },
  { value: "multiselect", icon: <GrMultiple /> },
];

const PuzzleActions = (
  <SimpleGrid
    columns={{ base: 1, lg: 2 }}
    gap={{ base: "0.5", sm: "1", md: "1.5" }}
  >
    {actions.map((action) => (
      <Button
        aspectRatio={2 / 1}
        key={action.value}
        padding={{
          sm: "0.25rem 1rem 0.25rem 1rem",
          md: "0.375rem 1rem 0.375rem 1rem",
        }}
        rounded="lg"
        height="fit-content"
        width="fit-content"
      >
        <Icon size={{ base: "sm", sm: "md", md: "2xl" }}>{action.icon}</Icon>
      </Button>
    ))}
  </SimpleGrid>
);

const inputs = [
  { value: "digit", title: "Digit" },
  { value: "corner", title: "Corner" },
  { value: "center", title: "Center" },
  { value: "color", title: "Color" },
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
          <RadioCard.Item key={input.value} value={input.value}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              {/* <Icon fontSize="2xl" color="fg.muted">
                {input.icon}
              </Icon> */}
              <RadioCard.ItemText>{input.title}</RadioCard.ItemText>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
  </Stack>
);

const PlayerInterface = (
  <Stack alignItems="center" direction={{ base: "row", lg: "column" }} gap="8">
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
