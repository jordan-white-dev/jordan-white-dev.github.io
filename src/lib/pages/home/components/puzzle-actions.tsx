import {
  type ButtonProps,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
} from "@chakra-ui/react";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";
import { MdOutlineFiberNew, MdRestartAlt } from "react-icons/md";

import { Tooltip } from "./tooltip";

const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
  sm: "xs",
  md: "lg",
  lg: "xl",
};
const ICON_BUTTON_WIDTH: IconButtonProps["width"] = {
  base: "2rem",
  sm: "3rem",
  md: "4rem",
  lg: "full",
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
      <Tooltip
        key="new-tooltip"
        content="Start a new puzzle"
        positioning={{ placement: "left-start" }}
      >
        <IconButton
          aria-label="New Puzzle"
          aspectRatio={{ lg: 2 / 1 }}
          key="new-puzzle"
          rounded={BUTTON_ROUNDED}
          size={ICON_BUTTON_SIZE}
          padding={{ base: "0.25rem 0 0.25rem 0" }}
          width={ICON_BUTTON_WIDTH}
        >
          <Icon
            height={{
              base: "5",
              sm: "8",
              md: "10",
              lg: "14",
            }}
            width={{
              base: "5",
              sm: "8",
              md: "10",
              lg: "14",
            }}
          >
            <MdOutlineFiberNew />
          </Icon>
        </IconButton>
      </Tooltip>
    </GridItem>

    <Tooltip
      key="undo-tooltip"
      content="Undo the last move"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Undo"
        aspectRatio={{ lg: 2 / 1 }}
        key="undo"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImUndo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      key="redo-tooltip"
      content="Redo the last undone move"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Redo"
        aspectRatio={{ lg: 2 / 1 }}
        key="redo"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImRedo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      key="check-tooltip"
      content="Check the puzzle solution"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Check Solution"
        aspectRatio={{ lg: 2 / 1 }}
        key="check"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImCheckmark />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      key="restart-tooltip"
      content="Restart the puzzle"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Restart"
        aspectRatio={{ lg: 2 / 1 }}
        key="restart"
        rounded={BUTTON_ROUNDED}
        size={ICON_BUTTON_SIZE}
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={MD_ICON_SIZE} width={MD_ICON_SIZE}>
          <MdRestartAlt />
        </Icon>
      </IconButton>
    </Tooltip>
  </SimpleGrid>
);
