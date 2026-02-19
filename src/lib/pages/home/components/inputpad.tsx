import {
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
  Square,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { FiDelete } from "react-icons/fi";
import { GrCheckbox, GrMultiple } from "react-icons/gr";

import { Tooltip } from "./tooltip";

const ICON_SIZE: IconProps["width"] = { base: "6", sm: "8", md: "11" };
const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
  base: "xs",
  sm: "lg",
  md: "2xl",
};
const ICON_BUTTON_TEXT_STYLE: IconButtonProps["textStyle"] = {
  base: "md",
  sm: "3xl",
  md: "5xl",
};

const NumberInput = (buttonValue: string) => {
  return (
    <GridItem colSpan={2}>
      <Square aspectRatio="square">
        <IconButton
          aspectRatio="square"
          color="white"
          colorPalette="blue"
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={ICON_BUTTON_TEXT_STYLE}
        >
          {buttonValue}
        </IconButton>
      </Square>
    </GridItem>
  );
};

export const InputPad = () => (
  <SimpleGrid
    columns={6}
    gap={{ base: "0.1874rem", sm: "1", md: "1.5" }}
    height="fit-content"
  >
    {NumberInput("1")}
    {NumberInput("2")}
    {NumberInput("3")}
    {NumberInput("4")}
    {NumberInput("5")}
    {NumberInput("6")}
    {NumberInput("7")}
    {NumberInput("8")}
    {NumberInput("9")}
    <GridItem
      alignContent="center"
      border={{ sm: "2px solid" }}
      borderColor={{ sm: "blue.border" }}
      colSpan={3}
      height="full"
      rounded="md"
      width="full"
    >
      <Tooltip
        content="Multiple cells can be selected while this is toggled"
        key="multiselect-tooltip"
      >
        <Stack alignItems="center" direction="column" gap="1">
          <Switch.Root colorPalette="blue" size="lg">
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
              <Switch.Indicator fallback={<Icon as={GrCheckbox} />}>
                <Icon as={GrMultiple} />
              </Switch.Indicator>
            </Switch.Control>
          </Switch.Root>
          <Text
            alignSelf="center"
            fontWeight="semibold"
            hideBelow="md"
            justifySelf="center"
          >
            Multiselect
          </Text>
        </Stack>
      </Tooltip>
    </GridItem>
    <GridItem colSpan={3}>
      <Tooltip
        content="Delete content from the selected cells"
        positioning={{ placement: "bottom" }}
      >
        <IconButton
          aria-label="Delete"
          color="white"
          colorPalette="blue"
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={ICON_BUTTON_TEXT_STYLE}
          width="full"
        >
          <Icon height={ICON_SIZE} width={ICON_SIZE}>
            <FiDelete />
          </Icon>
        </IconButton>
      </Tooltip>
    </GridItem>
  </SimpleGrid>
);
