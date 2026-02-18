import {
  Button,
  type ButtonProps,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
} from "@chakra-ui/react";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";
import { MdRestartAlt } from "react-icons/md";

import { Tooltip } from "./tooltip";

const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
  sm: "xs",
  md: "lg",
  lg: "xl",
};
const IM_ICON_SIZE: IconProps["width"] = {
  base: "4",
  sm: "4.5",
  md: "6",
  lg: "7",
};
const MD_ICON_SIZE: IconProps["width"] = {
  base: "5",
  sm: "7",
  md: "8",
  lg: "9",
};
const BUTTON_ROUNDED: ButtonProps["rounded"] = {
  base: "sm",
  sm: "md",
};

export const PuzzleActions = () => (
  <SimpleGrid
    columns={{ base: 1, lg: 2 }}
    columnGap={{ base: "0.5", sm: "1", lg: "3" }}
    rowGap={{ base: "0.5", sm: "1" }}
  >
    <GridItem colSpan={{ base: 1, lg: 2 }}>
      <Button
        aria-label="New Puzzle"
        fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
        key="new-puzzle"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "1" }}
        width="full"
      >
        New Puzzle
      </Button>
    </GridItem>

    <Tooltip
      key="undo-tooltip"
      content="Undo"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Undo"
        aspectRatio={{ lg: 2 / 1 }}
        key="undo"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width="full"
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImUndo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      key="redo-tooltip"
      content="Redo"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Redo"
        aspectRatio={{ lg: 2 / 1 }}
        key="redo"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width="full"
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImRedo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      key="submit-tooltip"
      content="Submit"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Submit"
        aspectRatio={{ lg: 2 / 1 }}
        key="submit"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width="full"
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImCheckmark />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      key="restart-tooltip"
      content="Restart"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Restart"
        aspectRatio={{ lg: 2 / 1 }}
        key="restart"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width="full"
      >
        <Icon height={MD_ICON_SIZE} width={MD_ICON_SIZE}>
          <MdRestartAlt />
        </Icon>
      </IconButton>
    </Tooltip>
  </SimpleGrid>
);
