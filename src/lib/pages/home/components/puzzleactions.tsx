import {
  Button,
  type ButtonProps,
  CloseButton,
  Dialog,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  Portal,
  SimpleGrid,
} from "@chakra-ui/react";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";
import { MdOutlineFiberNew, MdRestartAlt } from "react-icons/md";

import { Tooltip } from "./tooltip";

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
    <Dialog.Root placement="center" size="xs">
      <GridItem colSpan={{ base: 1, lg: 2 }}>
        <Tooltip
          content="Start a new puzzle"
          key="new-tooltip"
          positioning={{ placement: "left-start" }}
        >
          <Dialog.Trigger asChild>
            <IconButton
              aria-label="New Puzzle"
              aspectRatio={{ lg: 2 / 1 }}
              height={ICON_BUTTON_HEIGHT}
              key="new-puzzle"
              padding={{ base: "0.25rem 0 0.25rem 0" }}
              rounded={BUTTON_ROUNDED}
              width={ICON_BUTTON_WIDTH}
            >
              <Icon height={MD_ICON_SIZE_ALT} width={MD_ICON_SIZE_ALT}>
                <MdOutlineFiberNew />
              </Icon>
            </IconButton>
          </Dialog.Trigger>
        </Tooltip>
      </GridItem>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm New</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to discard the current puzzle and generate a
              new one? All progress will be lost!
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="blue">New Puzzle</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>

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
        width={ICON_BUTTON_WIDTH}
      >
        <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
          <ImRedo />
        </Icon>
      </IconButton>
    </Tooltip>

    <Dialog.Root placement="center" size="xs">
      <Tooltip
        content="Check the puzzle solution"
        key="check-tooltip"
        positioning={{ placement: "left-start" }}
      >
        <Dialog.Trigger asChild>
          <IconButton
            aria-label="Check Solution"
            aspectRatio={{ lg: 2 / 1 }}
            height={ICON_BUTTON_HEIGHT}
            key="check"
            padding={{ base: "0.25rem 0 0.25rem 0" }}
            rounded={BUTTON_ROUNDED}
            width={ICON_BUTTON_WIDTH}
          >
            <Icon height={IM_ICON_SIZE} width={IM_ICON_SIZE}>
              <ImCheckmark />
            </Icon>
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Okay</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>

    <Dialog.Root placement="center" size="xs">
      <Tooltip
        content="Restart the puzzle"
        key="restart-tooltip"
        positioning={{ placement: "left-start" }}
      >
        <Dialog.Trigger asChild>
          <IconButton
            aria-label="Restart"
            aspectRatio={{ lg: 2 / 1 }}
            height={ICON_BUTTON_HEIGHT}
            key="restart"
            padding={{ base: "0.25rem 0 0.25rem 0" }}
            rounded={BUTTON_ROUNDED}
            width={ICON_BUTTON_WIDTH}
          >
            <Icon height={MD_ICON_SIZE} width={MD_ICON_SIZE}>
              <MdRestartAlt />
            </Icon>
          </IconButton>
        </Dialog.Trigger>
      </Tooltip>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Confirm Restart</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              Are you sure you want to restart the puzzle? All progress will be
              lost!
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="blue">Restart Puzzle</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  </SimpleGrid>
);
