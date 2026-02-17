import {
  GridItem,
  Icon,
  IconButton,
  SimpleGrid,
  Square,
} from "@chakra-ui/react";
import { FiDelete } from "react-icons/fi";

import { Tooltip } from "./tooltip";

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

export const NumberPad = (
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
