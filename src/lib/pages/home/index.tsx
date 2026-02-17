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

import { CenterSVG, ColorSVG, CornerSVG, DigitSVG } from "./components/svgs";
import { Tooltip } from "./components/tooltip";

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
        backgroundColor="blue.fg"
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
      <Tooltip content="Delete" positioning={{ placement: "bottom" }}>
        <IconButton
          aria-label="Delete"
          backgroundColor="blue.fg"
          color="white"
          rounded="md"
          size={{ base: "xs", sm: "lg", md: "2xl" }}
          textStyle={{ base: "md", sm: "3xl", md: "5xl" }}
          width="full"
        >
          <Icon
            height={{ base: "6", sm: "8", md: "11" }}
            width={{ base: "6", sm: "8", md: "11" }}
          >
            <FiDelete />
          </Icon>
        </IconButton>
      </Tooltip>
    </GridItem>
  </SimpleGrid>
);

const actions = [
  { value: "new-puzzle", label: "New Puzzle", text: "New Puzzle" },
  { value: "undo", label: "Undo", icon: <ImUndo /> },
  { value: "redo", label: "Redo", icon: <ImRedo /> },
  { value: "submit", label: "Submit", icon: <ImCheckmark /> },
  { value: "multiselect", label: "Multiselect", icon: <GrMultiple /> },
];

const PuzzleActions = (
  <SimpleGrid
    columns={{ base: 1, lg: 2 }}
    columnGap={{ base: "0.5", sm: "1", lg: "3" }}
    rowGap={{ base: "0.5", sm: "1" }}
  >
    {actions.map((action) =>
      action.icon ? (
        <Tooltip
          key={`${action.value}-tooltip`}
          content={action.label}
          positioning={{ placement: "left-start" }}
        >
          <IconButton
            aria-label={action.label}
            aspectRatio={{ lg: 2 / 1 }}
            key={action.value}
            rounded={{ base: "sm", sm: "md" }}
            size={{ sm: "xs", md: "lg", lg: "xl" }}
            padding={{ base: "0.25rem 0 0.25rem 0" }}
            width="full"
          >
            <Icon
              height={{ base: "4", sm: "4.5", md: "6", lg: "7" }}
              width={{ base: "4", sm: "4.5", md: "6", lg: "7" }}
            >
              {action.icon}
            </Icon>
          </IconButton>
        </Tooltip>
      ) : (
        action.text && (
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Button
              aria-label={action.label}
              fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
              key={action.value}
              rounded={{ base: "sm", sm: "md" }}
              size={{ sm: "xs", md: "lg", lg: "xl" }}
              padding={{ base: "1" }}
              width="full"
            >
              {action.text}
            </Button>
          </GridItem>
        )
      ),
    )}
  </SimpleGrid>
);

const inputs = [
  { value: "digit", label: "Digit", icon: <DigitSVG /> },
  { value: "color", label: "Color", icon: <ColorSVG /> },
  { value: "corner", label: "Corner", icon: <CornerSVG /> },
  { value: "center", label: "Center", icon: <CenterSVG /> },
];

const InputRadioCard = (
  <RadioCard.Root
    align="center"
    colorPalette="orange"
    defaultValue="digit"
    variant="solid"
  >
    <SimpleGrid
      columns={{ base: 1, lg: 2 }}
      gap={{ base: "0.5", sm: "1", md: "0.5833rem", lg: "3" }}
      minWidth={{ lg: "12.75rem" }}
    >
      {inputs.map((input) => (
        <RadioCard.Item
          alignItems="center"
          aria-label={input.label}
          key={input.value}
          padding="0"
          value={input.value}
        >
          <RadioCard.ItemHiddenInput />
          <Tooltip
            content={input.label}
            positioning={{ placement: "right-start" }}
          >
            <RadioCard.ItemControl padding="0">
              <Icon
                boxSize={{
                  base: "1.922rem",
                  sm: "2.625rem",
                  md: "3.72rem",
                  lg: 20,
                }}
                fill="black"
              >
                {input.icon}
              </Icon>
            </RadioCard.ItemControl>
          </Tooltip>
        </RadioCard.Item>
      ))}
    </SimpleGrid>
  </RadioCard.Root>
);

const PlayerInterface = (
  <Stack
    alignItems="start"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    {PuzzleActions}
    {NumberPad}
    {InputRadioCard}
  </Stack>
);

const Home = () => {
  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap={{ base: "4", md: "8" }}
    >
      {SudokuGrid}
      {PlayerInterface}
    </Flex>
  );
};

export default Home;
