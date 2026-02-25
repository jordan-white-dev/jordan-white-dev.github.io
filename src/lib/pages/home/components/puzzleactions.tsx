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
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";
import { MdOutlineFiberNew, MdRestartAlt } from "react-icons/md";

import {
  type BoardState,
  buildBoardState,
  type CellState,
  getNewStartingBoardStates,
  type PuzzleHistory,
  type RawBoardState,
} from "..";
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
  icon: ReactNode;
  iconSize: IconProps["width"];
  onClick?: () => void;
};

const ActionButton = ({
  icon,
  iconSize,
  onClick,
  ...props
}: ActionButtonProps) => (
  <IconButton
    aspectRatio={{ lg: 2 / 1 }}
    height={ICON_BUTTON_HEIGHT}
    padding="0.25rem 0"
    rounded={BUTTON_ROUNDED}
    width={ICON_BUTTON_WIDTH}
    onClick={onClick}
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
  closeButtonColorPalette?: ButtonProps["colorPalette"];
  closeButtonText: string;
  closeButtonVariant?: ButtonProps["variant"];
  dialogBodyText: string;
  dialogTitleText: string;
  dialogTrigger: ReactNode;
  onConfirm?: () => void;
};

const ActionDialog = ({
  actionButtonText,
  closeButtonColorPalette,
  closeButtonText,
  closeButtonVariant,
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
              <Button
                colorPalette={
                  closeButtonColorPalette ? closeButtonColorPalette : "gray"
                }
                variant={closeButtonVariant ? closeButtonVariant : "outline"}
              >
                {closeButtonText}
              </Button>
            </Dialog.ActionTrigger>

            {actionButtonText && (
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="blue" onClick={onConfirm}>
                  {actionButtonText}
                </Button>
              </Dialog.ActionTrigger>
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
type NewPuzzleButtonProps = {
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
};

const NewPuzzleButton = ({
  setPuzzleHistory,
  setStartingRawBoardState,
}: NewPuzzleButtonProps) => {
  const handleNewPuzzleConfirmation = () => {
    const newStartingBoardStates = getNewStartingBoardStates();
    setStartingRawBoardState(newStartingBoardStates.rawBoardState);
    const newPuzzleHistory = {
      currentBoardStateIndex: 0,
      boardStateHistory: [newStartingBoardStates.boardState],
    };
    setPuzzleHistory(newPuzzleHistory);
  };

  return (
    <GridItem colSpan={{ base: 1, lg: 2 }}>
      <ActionDialog
        actionButtonText="New Puzzle"
        closeButtonText="Cancel"
        dialogBodyText="Are you sure you want to start a new puzzle? All progress will be lost!"
        dialogTitleText="Confirm New"
        dialogTrigger={
          <ActionTooltip tooltipText="Start a new puzzle">
            <Dialog.Trigger asChild>
              <ActionButton
                icon={<MdOutlineFiberNew />}
                iconSize={MD_ICON_SIZE_ALT}
              />
            </Dialog.Trigger>
          </ActionTooltip>
        }
        onConfirm={handleNewPuzzleConfirmation}
      />
    </GridItem>
  );
};
// #endregion

// #region Undo Button
type UndoButtonProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const UndoButton = ({ puzzleHistory, setPuzzleHistory }: UndoButtonProps) => {
  const handleUndoButton = () => {
    if (
      puzzleHistory.boardStateHistory.length > 1 &&
      puzzleHistory.currentBoardStateIndex > 0
    ) {
      setPuzzleHistory((currentPuzzleHistory) => {
        const newPuzzleHistory = {
          ...currentPuzzleHistory,
          currentBoardStateIndex:
            currentPuzzleHistory.currentBoardStateIndex - 1,
        };

        return newPuzzleHistory;
      });
    }
  };

  return (
    <ActionTooltip tooltipText="Undo the last move">
      <ActionButton
        icon={<ImUndo />}
        iconSize={IM_ICON_SIZE}
        onClick={handleUndoButton}
      />
    </ActionTooltip>
  );
};
// #endregion

// #region Redo Button
type RedoButtonProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RedoButton = ({ puzzleHistory, setPuzzleHistory }: RedoButtonProps) => {
  const handleRedoButton = () => {
    if (
      puzzleHistory.currentBoardStateIndex <
      puzzleHistory.boardStateHistory.length - 1
    ) {
      setPuzzleHistory((currentPuzzleHistory) => {
        const newPuzzleHistory = {
          ...currentPuzzleHistory,
          currentBoardStateIndex:
            currentPuzzleHistory.currentBoardStateIndex + 1,
        };

        return newPuzzleHistory;
      });
    }
  };

  return (
    <ActionTooltip tooltipText="Redo the last undone move">
      <ActionButton
        icon={<ImRedo />}
        iconSize={IM_ICON_SIZE}
        onClick={handleRedoButton}
      />
    </ActionTooltip>
  );
};
// #endregion

// #region Check Solution Button
type CheckSolutionButtonProps = {
  puzzleHistory: PuzzleHistory;
};

const getDigitDisplayValue = (cellState: CellState): string | undefined => {
  if ("startingDigit" in cellState.cellContent)
    return cellState.cellContent.startingDigit;
  else if ("playerDigit" in cellState.cellContent)
    return cellState.cellContent.playerDigit;
  else if (
    "centerMarkups" in cellState.cellContent ||
    "cornerMarkups" in cellState.cellContent
  )
    return undefined;
};

const getIsSudokuSolved = (boardState: BoardState): boolean => {
  const rows: Array<Set<string>> = Array.from({ length: 9 }, () => new Set());
  const columns: Array<Set<string>> = Array.from(
    { length: 9 },
    () => new Set(),
  );
  const boxes: Array<Set<string>> = Array.from({ length: 9 }, () => new Set());

  for (const cellState of boardState) {
    const digit = getDigitDisplayValue(cellState);
    if (!digit || digit === "") return false;

    const rowIndex = cellState.rowNumber - 1;
    const columnIndex = cellState.columnNumber - 1;
    const boxIndex = cellState.boxNumber - 1;

    if (rows[rowIndex].has(digit)) return false;
    if (columns[columnIndex].has(digit)) return false;
    if (boxes[boxIndex].has(digit)) return false;

    rows[rowIndex].add(digit);
    columns[columnIndex].add(digit);
    boxes[boxIndex].add(digit);
  }

  return true;
};

const CheckSolutionButton = ({ puzzleHistory }: CheckSolutionButtonProps) => {
  const isSudokuSolved = getIsSudokuSolved(
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex],
  );

  return (
    <ActionDialog
      closeButtonText="Okay"
      closeButtonColorPalette={isSudokuSolved ? "blue" : "red"}
      closeButtonVariant="solid"
      dialogBodyText={
        isSudokuSolved
          ? "You solved the puzzle!"
          : "That doesn't look quite right. Some digits are missing or incorrect."
      }
      dialogTitleText={isSudokuSolved ? "Congratulations" : "Try Again"}
      dialogTrigger={
        <ActionTooltip tooltipText="Check the current solution">
          <Dialog.Trigger asChild>
            <ActionButton icon={<ImCheckmark />} iconSize={IM_ICON_SIZE} />
          </Dialog.Trigger>
        </ActionTooltip>
      }
    />
  );
};
// #endregion

// #region Restart Puzzle Button
const getRestartedBoardState = (
  startingRawBoardState: RawBoardState,
): BoardState => {
  const restartedBoardState = buildBoardState(startingRawBoardState);
  return restartedBoardState;
};

type RestartPuzzleButtonProps = {
  startingRawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RestartPuzzleButton = ({
  startingRawBoardState,
  setPuzzleHistory,
}: RestartPuzzleButtonProps) => {
  const handleRestartPuzzleConfirmation = () => {
    const restartedBoardState = getRestartedBoardState(startingRawBoardState);
    const newPuzzleHistory = {
      currentBoardStateIndex: 0,
      boardStateHistory: [restartedBoardState],
    };
    setPuzzleHistory(newPuzzleHistory);
  };

  return (
    <ActionDialog
      actionButtonText="Restart Puzzle"
      closeButtonText="Cancel"
      dialogBodyText="Are you sure you want to restart the puzzle? All progress will be lost!"
      dialogTitleText="Confirm Restart"
      dialogTrigger={
        <ActionTooltip tooltipText="Restart the puzzle">
          <Dialog.Trigger asChild>
            <ActionButton icon={<MdRestartAlt />} iconSize={MD_ICON_SIZE} />
          </Dialog.Trigger>
        </ActionTooltip>
      }
      onConfirm={handleRestartPuzzleConfirmation}
    />
  );
};
// #endregion

type PuzzleActionsProps = {
  puzzleHistory: PuzzleHistory;
  startingRawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
};

export const PuzzleActions = ({
  puzzleHistory,
  startingRawBoardState,
  setPuzzleHistory,
  setStartingRawBoardState,
}: PuzzleActionsProps) => (
  <SimpleGrid
    columnGap={{ base: "0.5", lg: "3" }}
    columns={{ base: 1, lg: 2 }}
    maxWidth="12.75rem"
    rowGap={{ base: "0.5", md: "0.2875rem" }}
  >
    <NewPuzzleButton
      setPuzzleHistory={setPuzzleHistory}
      setStartingRawBoardState={setStartingRawBoardState}
    />
    <UndoButton
      puzzleHistory={puzzleHistory}
      setPuzzleHistory={setPuzzleHistory}
    />
    <RedoButton
      puzzleHistory={puzzleHistory}
      setPuzzleHistory={setPuzzleHistory}
    />
    <CheckSolutionButton puzzleHistory={puzzleHistory} />
    <RestartPuzzleButton
      startingRawBoardState={startingRawBoardState}
      setPuzzleHistory={setPuzzleHistory}
    />
  </SimpleGrid>
);
