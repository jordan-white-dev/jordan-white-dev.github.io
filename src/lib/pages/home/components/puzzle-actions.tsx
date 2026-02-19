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

// const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
//   sm: "xs",
//   md: "lg",
//   lg: "xl",
// };
const ICON_BUTTON_HEIGHT: IconButtonProps["height"] = {
  base: "1.6757rem",
  sm: "2.25rem",
  md: "3.196rem",
  lg: "3.25rem",
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
const MD_ICON_SIZE_ALT: IconProps["width"] = {
  base: "5",
  sm: "8",
  md: "10",
  lg: "14",
};
const BUTTON_ROUNDED: ButtonProps["rounded"] = {
  base: "sm",
  sm: "md",
};

export const PuzzleActions = () => (
  <SimpleGrid
    columnGap={{ base: "0.5", lg: "3" }}
    columns={{ base: 1, lg: 2 }}
    rowGap={{ base: "0.5", md: "0.2875rem" }}
  >
    <GridItem colSpan={{ base: 1, lg: 2 }}>
      <Tooltip
        content="Start a new puzzle"
        key="new-tooltip"
        positioning={{ placement: "left-start" }}
      >
        <IconButton
          aria-label="New Puzzle"
          aspectRatio={{ lg: 2 / 1 }}
          height={ICON_BUTTON_HEIGHT}
          key="new-puzzle"
          padding={{ base: "0.25rem 0 0.25rem 0" }}
          rounded={BUTTON_ROUNDED}
          // size={ICON_BUTTON_SIZE}
          width={ICON_BUTTON_WIDTH}
        >
          <Icon height={MD_ICON_SIZE_ALT} width={MD_ICON_SIZE_ALT}>
            <MdOutlineFiberNew />
          </Icon>
        </IconButton>
      </Tooltip>
    </GridItem>

    <Tooltip
      content="Undo the last move"
      key="undo-tooltip"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Undo"
        aspectRatio={{ lg: 2 / 1 }}
        height={ICON_BUTTON_HEIGHT}
        key="undo"
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        rounded={BUTTON_ROUNDED}
        // size={ICON_BUTTON_SIZE}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImUndo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      content="Redo the last undone move"
      key="redo-tooltip"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Redo"
        aspectRatio={{ lg: 2 / 1 }}
        height={ICON_BUTTON_HEIGHT}
        key="redo"
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        rounded={BUTTON_ROUNDED}
        // size={ICON_BUTTON_SIZE}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImRedo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      content="Check the puzzle solution"
      key="check-tooltip"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Check Solution"
        aspectRatio={{ lg: 2 / 1 }}
        height={ICON_BUTTON_HEIGHT}
        key="check"
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        rounded={BUTTON_ROUNDED}
        // size={ICON_BUTTON_SIZE}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImCheckmark />
        </Icon>
      </IconButton>
    </Tooltip>

    <Tooltip
      content="Restart the puzzle"
      key="restart-tooltip"
      positioning={{ placement: "left-start" }}
    >
      <IconButton
        aria-label="Restart"
        aspectRatio={{ lg: 2 / 1 }}
        height={ICON_BUTTON_HEIGHT}
        key="restart"
        padding={{ base: "0.25rem 0 0.25rem 0" }}
        rounded={BUTTON_ROUNDED}
        // size={ICON_BUTTON_SIZE}
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={MD_ICON_SIZE} width={MD_ICON_SIZE}>
          <MdRestartAlt />
        </Icon>
      </IconButton>
    </Tooltip>
  </SimpleGrid>
);
