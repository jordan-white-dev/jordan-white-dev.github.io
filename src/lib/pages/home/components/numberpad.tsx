import {
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
  Square,
} from "@chakra-ui/react";
import { FiDelete } from "react-icons/fi";

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

const NumpadButton = (buttonValue: string) => {
  return (
    <Square aspectRatio="square">
      <IconButton
        aspectRatio="square"
        backgroundColor="blue.fg"
        color="white"
        rounded="md"
        size={ICON_BUTTON_SIZE}
        textStyle={ICON_BUTTON_TEXT_STYLE}
      >
        {buttonValue}
      </IconButton>
    </Square>
  );
};

export const NumberPad = () => (
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
