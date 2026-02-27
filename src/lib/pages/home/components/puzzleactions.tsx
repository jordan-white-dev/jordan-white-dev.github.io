import {
  Button,
  type ButtonProps,
  Dialog,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  Portal,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { ImCheckmark, ImRedo, ImStopwatch, ImUndo } from "react-icons/im";
import { MdOutlineFiberNew, MdRestartAlt } from "react-icons/md";

import {
  type BoardState,
  buildBoardState,
  type CellState,
  getNewStartingBoardStates,
  type PuzzleHistory,
  type RawBoardState,
} from "./puzzle";
import { useStopwatchCommands, useStopwatchTime } from "./stopwatch";
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

const handleSetPuzzleHistory = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
  boardStateIndexChange: number,
) => {
  setPuzzleHistory((currentPuzzleHistory) => {
    const newPuzzleHistory = {
      ...currentPuzzleHistory,
      currentBoardStateIndex:
        currentPuzzleHistory.currentBoardStateIndex + boardStateIndexChange,
    };

    return newPuzzleHistory;
  });
};

const startStopwatchIfNotInStayPausedMode = (
  isStayPausedMode: boolean,
  start: () => void,
) => {
  if (!isStayPausedMode) start();
};

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
  dialogBodyText: string;
  dialogFooter: ReactNode;
  dialogTitleText: string;
  dialogTrigger: ReactNode;
  isStayPausedMode: boolean;
};

const ActionDialog = ({
  dialogBodyText,
  dialogFooter,
  dialogTitleText,
  dialogTrigger,
  isStayPausedMode,
}: ActionDialogProps) => {
  const { start } = useStopwatchCommands();

  return (
    <Dialog.Root
      placement="center"
      size="sm"
      onEscapeKeyDown={() =>
        startStopwatchIfNotInStayPausedMode(isStayPausedMode, start)
      }
      onPointerDownOutside={() =>
        startStopwatchIfNotInStayPausedMode(isStayPausedMode, start)
      }
    >
      {dialogTrigger}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{dialogTitleText}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>{dialogBodyText}</Dialog.Body>

            {dialogFooter}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
// #endregion

// #region New Puzzle Button
const resetStopwatchAndHandleNewPuzzleConfirmation = (
  reset: () => void,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>,
) => {
  reset();

  const newStartingBoardStates = getNewStartingBoardStates();
  setStartingRawBoardState(newStartingBoardStates.rawBoardState);
  const newPuzzleHistory = {
    currentBoardStateIndex: 0,
    boardStateHistory: [newStartingBoardStates.boardState],
  };
  setPuzzleHistory(newPuzzleHistory);
};

type NewPuzzleButtonProps = {
  isStayPausedMode: boolean;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
};

const NewPuzzleButton = ({
  isStayPausedMode,
  setPuzzleHistory,
  setStartingRawBoardState,
}: NewPuzzleButtonProps) => {
  const { pause, reset, start } = useStopwatchCommands();

  return (
    <GridItem colSpan={{ base: 1, lg: 2 }}>
      <ActionDialog
        dialogBodyText="Are you sure you want to start a new puzzle? All progress will be lost!"
        dialogFooter={
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button
                colorPalette="gray"
                variant="outline"
                onClick={() =>
                  startStopwatchIfNotInStayPausedMode(isStayPausedMode, start)
                }
              >
                Cancel
              </Button>
            </Dialog.ActionTrigger>

            <Dialog.ActionTrigger asChild>
              <Button
                colorPalette="blue"
                onClick={() =>
                  resetStopwatchAndHandleNewPuzzleConfirmation(
                    reset,
                    setPuzzleHistory,
                    setStartingRawBoardState,
                  )
                }
              >
                New Puzzle
              </Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
        }
        dialogTitleText="Confirm New"
        dialogTrigger={
          <ActionTooltip tooltipText="Start a new puzzle">
            <Dialog.Trigger asChild onClick={pause}>
              <ActionButton
                icon={<MdOutlineFiberNew />}
                iconSize={MD_ICON_SIZE_ALT}
              />
            </Dialog.Trigger>
          </ActionTooltip>
        }
        isStayPausedMode={isStayPausedMode}
      />
    </GridItem>
  );
};
// #endregion

// #region Undo Button
const handleUndoButton = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  if (
    puzzleHistory.boardStateHistory.length > 1 &&
    puzzleHistory.currentBoardStateIndex > 0
  ) {
    handleSetPuzzleHistory(setPuzzleHistory, -1);
  }
};

type UndoButtonProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const UndoButton = ({ puzzleHistory, setPuzzleHistory }: UndoButtonProps) => (
  <ActionTooltip tooltipText="Undo the last move">
    <ActionButton
      icon={<ImUndo />}
      iconSize={IM_ICON_SIZE}
      onClick={() => handleUndoButton(puzzleHistory, setPuzzleHistory)}
    />
  </ActionTooltip>
);
// #endregion

// #region Redo Button
const handleRedoButton = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  if (
    puzzleHistory.currentBoardStateIndex <
    puzzleHistory.boardStateHistory.length - 1
  ) {
    handleSetPuzzleHistory(setPuzzleHistory, 1);
  }
};

type RedoButtonProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RedoButton = ({ puzzleHistory, setPuzzleHistory }: RedoButtonProps) => (
  <ActionTooltip tooltipText="Redo the last undone move">
    <ActionButton
      icon={<ImRedo />}
      iconSize={IM_ICON_SIZE}
      onClick={() => handleRedoButton(puzzleHistory, setPuzzleHistory)}
    />
  </ActionTooltip>
);
// #endregion

// #region Check Solution Button
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

const getIsPuzzleSolved = (boardState: BoardState): boolean => {
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

const startStopwatchIfSolvedAndNotInStayPausedMode = (
  isPuzzleSolved: boolean,
  isStayPausedMode: boolean,
  start: () => void,
) => {
  if (!(isPuzzleSolved || isStayPausedMode)) {
    start();
  }
};

type CheckSolutionButtonProps = {
  isStayPausedMode: boolean;
  puzzleHistory: PuzzleHistory;
};

const CheckSolutionButton = ({
  isStayPausedMode,
  puzzleHistory,
}: CheckSolutionButtonProps) => {
  const { pause, start } = useStopwatchCommands();
  const { stopwatchTime } = useStopwatchTime();

  const isPuzzleSolved = getIsPuzzleSolved(
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex],
  );

  if (isPuzzleSolved) pause();

  return (
    <ActionDialog
      dialogBodyText={
        isPuzzleSolved
          ? `You solved the puzzle in ${stopwatchTime}!`
          : "That doesn't look quite right. Some digits are missing or incorrect."
      }
      dialogFooter={
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button
              colorPalette={isPuzzleSolved ? "blue" : "red"}
              variant="solid"
              onClick={() =>
                startStopwatchIfSolvedAndNotInStayPausedMode(
                  isPuzzleSolved,
                  isStayPausedMode,
                  start,
                )
              }
            >
              Okay
            </Button>
          </Dialog.ActionTrigger>
        </Dialog.Footer>
      }
      dialogTitleText={isPuzzleSolved ? "Congratulations" : "Try Again"}
      dialogTrigger={
        <ActionTooltip tooltipText="Check the current solution">
          <Dialog.Trigger asChild onClick={pause}>
            <ActionButton icon={<ImCheckmark />} iconSize={IM_ICON_SIZE} />
          </Dialog.Trigger>
        </ActionTooltip>
      }
      isStayPausedMode={isStayPausedMode}
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

const handleRestartPuzzleConfirmation = (
  startingRawBoardState: RawBoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const restartedBoardState = getRestartedBoardState(startingRawBoardState);
  const newPuzzleHistory = {
    currentBoardStateIndex: 0,
    boardStateHistory: [restartedBoardState],
  };
  setPuzzleHistory(newPuzzleHistory);
};

const resetStopwatchAndHandleRestartPuzzleConfirmation = (
  startingRawBoardState: RawBoardState,
  reset: () => void,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  reset();

  handleRestartPuzzleConfirmation(startingRawBoardState, setPuzzleHistory);
};

const startStopwatchAndHandleRestartPuzzleConfirmation = (
  startingRawBoardState: RawBoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
  start: () => void,
) => {
  start();

  handleRestartPuzzleConfirmation(startingRawBoardState, setPuzzleHistory);
};

type RestartPuzzleDialogFooterProps = {
  isStayPausedMode: boolean;
  startingRawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RestartPuzzleDialogFooter = ({
  isStayPausedMode,
  startingRawBoardState,
  setPuzzleHistory,
}: RestartPuzzleDialogFooterProps) => {
  const { reset, start } = useStopwatchCommands();

  return (
    <Dialog.Footer justifyContent="center">
      <Stack direction={{ base: "column-reverse", sm: "row" }}>
        <Dialog.ActionTrigger asChild>
          <Button
            colorPalette="gray"
            variant="outline"
            onClick={() =>
              startStopwatchIfNotInStayPausedMode(isStayPausedMode, start)
            }
          >
            Cancel
          </Button>
        </Dialog.ActionTrigger>

        <Dialog.ActionTrigger asChild>
          <Button
            colorPalette="blue"
            onClick={() =>
              resetStopwatchAndHandleRestartPuzzleConfirmation(
                startingRawBoardState,
                reset,
                setPuzzleHistory,
              )
            }
          >
            <MdRestartAlt /> Restart
          </Button>
        </Dialog.ActionTrigger>

        <Dialog.ActionTrigger asChild>
          <Button
            colorPalette="blue"
            onClick={() =>
              startStopwatchAndHandleRestartPuzzleConfirmation(
                startingRawBoardState,
                setPuzzleHistory,
                start,
              )
            }
          >
            <MdRestartAlt /> + <ImStopwatch /> Keep Time
          </Button>
        </Dialog.ActionTrigger>
      </Stack>
    </Dialog.Footer>
  );
};

type RestartPuzzleButtonProps = {
  isStayPausedMode: boolean;
  startingRawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RestartPuzzleButton = ({
  isStayPausedMode,
  startingRawBoardState,
  setPuzzleHistory,
}: RestartPuzzleButtonProps) => {
  const { pause } = useStopwatchCommands();

  return (
    <ActionDialog
      dialogBodyText="Are you sure you want to restart the puzzle? All progress will be lost!"
      dialogFooter={
        <RestartPuzzleDialogFooter
          isStayPausedMode={isStayPausedMode}
          startingRawBoardState={startingRawBoardState}
          setPuzzleHistory={setPuzzleHistory}
        />
      }
      dialogTitleText="Confirm Restart"
      dialogTrigger={
        <ActionTooltip tooltipText="Restart the puzzle">
          <Dialog.Trigger asChild onClick={pause}>
            <ActionButton icon={<MdRestartAlt />} iconSize={MD_ICON_SIZE} />
          </Dialog.Trigger>
        </ActionTooltip>
      }
      isStayPausedMode={isStayPausedMode}
    />
  );
};
// #endregion

type PuzzleActionsProps = {
  isStayPausedMode: boolean;
  puzzleHistory: PuzzleHistory;
  startingRawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
  setStartingRawBoardState: Dispatch<SetStateAction<RawBoardState>>;
};

export const PuzzleActions = ({
  isStayPausedMode,
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
      isStayPausedMode={isStayPausedMode}
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
    <CheckSolutionButton
      isStayPausedMode={isStayPausedMode}
      puzzleHistory={puzzleHistory}
    />
    <RestartPuzzleButton
      isStayPausedMode={isStayPausedMode}
      startingRawBoardState={startingRawBoardState}
      setPuzzleHistory={setPuzzleHistory}
    />
  </SimpleGrid>
);
