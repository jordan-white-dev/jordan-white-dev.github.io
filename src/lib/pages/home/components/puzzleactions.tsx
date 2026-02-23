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
import type { ReactNode } from "react";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";
import { MdOutlineFiberNew, MdRestartAlt } from "react-icons/md";

import { Tooltip } from "./tooltip";

// #region CSS Properties
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
// #endregion

// #region Action Button
type ActionButtonProps = {
  ariaLabel: string;
  icon: ReactNode;
  iconSize: IconProps["width"];
} & Omit<IconButtonProps, "aria-label">;

const ActionButton = ({
  ariaLabel,
  icon,
  iconSize,
  ...props
}: ActionButtonProps) => (
  <IconButton
    aria-label={ariaLabel}
    aspectRatio={{ lg: 2 / 1 }}
    height={ICON_BUTTON_HEIGHT}
    padding="0.25rem 0"
    rounded={BUTTON_ROUNDED}
    width={ICON_BUTTON_WIDTH}
    {...props}
  >
    <Icon height={iconSize} width={iconSize}>
      {icon}
    </Icon>
  </IconButton>
);
// #endregion

// #region Action Tooltip
type ActionTooltipProps = {
  children: ReactNode;
  tooltipText: string;
};

const ActionTooltip = ({ children, tooltipText }: ActionTooltipProps) => (
  <Tooltip content={tooltipText} positioning={{ placement: "left-start" }}>
    {children}
  </Tooltip>
);
// #endregion

// #region Action Dialog
type ActionDialogProps = {
  actionButtonText?: string;
  closeDialogButtonText: string;
  dialogBodyText: string;
  dialogTitleText: string;
  dialogTrigger: ReactNode;
  onConfirm?: () => void;
};

const ActionDialog = ({
  actionButtonText,
  closeDialogButtonText,
  dialogBodyText,
  dialogTitleText,
  dialogTrigger,
  onConfirm,
}: ActionDialogProps) => (
  <Dialog.Root placement="center" size="xs">
    {dialogTrigger}
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{dialogTitleText}</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>{dialogBodyText}</Dialog.Body>

          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">{closeDialogButtonText}</Button>
            </Dialog.ActionTrigger>

            {actionButtonText && (
              <Button colorPalette="blue" onClick={onConfirm}>
                {actionButtonText}
              </Button>
            )}
          </Dialog.Footer>

          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
// #endregion

// #region New Puzzle Button
const NewPuzzleButton = () => (
  <GridItem colSpan={{ base: 1, lg: 2 }}>
    <ActionDialog
      actionButtonText="New Puzzle"
      closeDialogButtonText="Cancel"
      dialogBodyText="Are you sure you want to start a new puzzle? All progress will be lost!"
      dialogTitleText="Confirm New"
      dialogTrigger={
        <ActionTooltip tooltipText="Start a new puzzle">
          <Dialog.Trigger asChild>
            <ActionButton
              ariaLabel="New Puzzle"
              icon={<MdOutlineFiberNew />}
              iconSize={MD_ICON_SIZE_ALT}
            />
          </Dialog.Trigger>
        </ActionTooltip>
      }
    />
  </GridItem>
);
// #endregion

// #region Undo Button
const UndoButton = () => (
  <ActionTooltip tooltipText="Undo the last move">
    <ActionButton ariaLabel="Undo" icon={<ImUndo />} iconSize={IM_ICON_SIZE} />
  </ActionTooltip>
);
// #endregion

// #region Redo Button
const RedoButton = () => (
  <ActionTooltip tooltipText="Redo the last undone move">
    <ActionButton ariaLabel="Redo" icon={<ImRedo />} iconSize={IM_ICON_SIZE} />
  </ActionTooltip>
);
// #endregion

// #region Check Solution Button
const CheckSolutionButton = () => (
  <ActionDialog
    closeDialogButtonText="Okay"
    dialogBodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    dialogTitleText="Dialog Title"
    dialogTrigger={
      <ActionTooltip tooltipText="Check the current solution">
        <Dialog.Trigger asChild>
          <ActionButton
            ariaLabel="Check Solution"
            icon={<ImCheckmark />}
            iconSize={IM_ICON_SIZE}
          />
        </Dialog.Trigger>
      </ActionTooltip>
    }
  />
);
// #endregion

// #region Restart Puzzle Button
const RestartPuzzleButton = () => (
  <ActionDialog
    actionButtonText="Restart Puzzle"
    closeDialogButtonText="Cancel"
    dialogBodyText="Are you sure you want to restart the puzzle? All progress will be lost!"
    dialogTitleText="Confirm Restart"
    dialogTrigger={
      <ActionTooltip tooltipText="Restart the puzzle">
        <Dialog.Trigger asChild>
          <ActionButton
            ariaLabel="Restart the puzzle"
            icon={<MdRestartAlt />}
            iconSize={MD_ICON_SIZE}
          />
        </Dialog.Trigger>
      </ActionTooltip>
    }
  />
);
// #endregion

export const PuzzleActions = () => (
  <SimpleGrid
    columnGap={{ base: "0.5", lg: "3" }}
    columns={{ base: 1, lg: 2 }}
    maxWidth="12.75rem"
    rowGap={{ base: "0.5", md: "0.2875rem" }}
  >
    <NewPuzzleButton />
    <UndoButton />
    <RedoButton />
    <CheckSolutionButton />
    <RestartPuzzleButton />
  </SimpleGrid>
);
