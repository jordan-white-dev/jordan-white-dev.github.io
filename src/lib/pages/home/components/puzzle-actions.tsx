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
import { useNavigate } from "@tanstack/react-router";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { ImCheckmark, ImRedo, ImStopwatch, ImUndo } from "react-icons/im";
import { MdOutlineFiberNew, MdRestartAlt } from "react-icons/md";
import { makepuzzle } from "sudoku";

import {
  buildBoardState,
  encodeRawSudokuStringAsBase36String,
  getStartingOrPlayerDigitInCellIfPresent,
  rawBoardStateToRawSudokuString,
} from "@/lib/shared/constants";
import type {
  BoardState,
  PuzzleHistory,
  RawBoardState,
} from "@/lib/shared/types";
import { useUserSettings } from "@/lib/utils/useUserSettings";

import { useSudokuStopwatch } from "../../../utils/useSudokuStopwatch";
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
  setPuzzleHistory((previousPuzzleHistory) => {
    const newPuzzleHistory = {
      ...previousPuzzleHistory,
      currentBoardStateIndex:
        previousPuzzleHistory.currentBoardStateIndex + boardStateIndexChange,
    };

    return newPuzzleHistory;
  });
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
};

const ActionDialog = ({
  dialogBodyText,
  dialogFooter,
  dialogTitleText,
  dialogTrigger,
}: ActionDialogProps) => {
  const { startStopwatchIfEnabled } = useSudokuStopwatch();

  return (
    <Dialog.Root
      placement="center"
      size="sm"
      onEscapeKeyDown={startStopwatchIfEnabled}
      onPointerDownOutside={startStopwatchIfEnabled}
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
const handleResetStopwatchAndNewPuzzleConfirmation = (
  resetStopwatch: () => void,
  navigateToNewPuzzle: ReturnType<typeof useNavigate>,
) => {
  resetStopwatch();

  const newRawBoardState: RawBoardState = makepuzzle();
  const rawSudokuString = rawBoardStateToRawSudokuString(newRawBoardState);
  const encodedBase36String =
    encodeRawSudokuStringAsBase36String(rawSudokuString);
  navigateToNewPuzzle({ to: `/puzzle/${encodedBase36String}` });
};

const NewPuzzleButton = () => {
  const { pauseStopwatch, resetStopwatch, startStopwatchIfEnabled } =
    useSudokuStopwatch();

  const navigate = useNavigate();

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
                onClick={startStopwatchIfEnabled}
              >
                Cancel
              </Button>
            </Dialog.ActionTrigger>

            <Dialog.ActionTrigger asChild>
              <Button
                colorPalette="blue"
                onClick={() =>
                  handleResetStopwatchAndNewPuzzleConfirmation(
                    resetStopwatch,
                    navigate,
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
            <Dialog.Trigger asChild onClick={pauseStopwatch}>
              <ActionButton
                icon={<MdOutlineFiberNew />}
                iconSize={MD_ICON_SIZE_ALT}
              />
            </Dialog.Trigger>
          </ActionTooltip>
        }
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
const getIsPuzzleSolved = (boardState: BoardState): boolean => {
  const rows: Array<Set<string>> = Array.from({ length: 9 }, () => new Set());
  const columns: Array<Set<string>> = Array.from(
    { length: 9 },
    () => new Set(),
  );
  const boxes: Array<Set<string>> = Array.from({ length: 9 }, () => new Set());

  for (const cellState of boardState) {
    const startingOrPlayerDigit = getStartingOrPlayerDigitInCellIfPresent(
      cellState.cellContent,
    );
    if (startingOrPlayerDigit === "") return false;

    const rowIndex = cellState.rowNumber - 1;
    const columnIndex = cellState.columnNumber - 1;
    const boxIndex = cellState.boxNumber - 1;

    if (rows[rowIndex].has(startingOrPlayerDigit)) return false;
    if (columns[columnIndex].has(startingOrPlayerDigit)) return false;
    if (boxes[boxIndex].has(startingOrPlayerDigit)) return false;

    rows[rowIndex].add(startingOrPlayerDigit);
    columns[columnIndex].add(startingOrPlayerDigit);
    boxes[boxIndex].add(startingOrPlayerDigit);
  }

  return true;
};

const getDialogBodyText = (
  isPuzzleSolved: boolean,
  disableStopwatchSetting: boolean,
  stopwatchTime: string,
): string => {
  const solvedText = disableStopwatchSetting
    ? "You solved the puzzle!"
    : `You solved the puzzle in ${stopwatchTime}!`;
  const notSolvedText =
    "That doesn't look quite right. Some digits are missing or incorrect.";

  return isPuzzleSolved ? solvedText : notSolvedText;
};

const startStopwatchAfterSolutionCheckIfAppropriate = (
  isPuzzleSolved: boolean,
  isStopwatchDisabled: boolean,
  startStopwatch: () => void,
) => {
  if (!(isPuzzleSolved || isStopwatchDisabled)) {
    startStopwatch();
  }
};

type CheckSolutionButtonProps = {
  puzzleHistory: PuzzleHistory;
};

const CheckSolutionButton = ({ puzzleHistory }: CheckSolutionButtonProps) => {
  const { formattedStopwatchTime, pauseStopwatch, startStopwatch } =
    useSudokuStopwatch();
  const { userSettings } = useUserSettings();

  const isPuzzleSolved = getIsPuzzleSolved(
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex],
  );

  return (
    <ActionDialog
      dialogBodyText={getDialogBodyText(
        isPuzzleSolved,
        userSettings.disableStopwatch,
        formattedStopwatchTime,
      )}
      dialogFooter={
        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button
              colorPalette={isPuzzleSolved ? "blue" : "red"}
              variant="solid"
              onClick={() =>
                startStopwatchAfterSolutionCheckIfAppropriate(
                  isPuzzleSolved,
                  userSettings.disableStopwatch,
                  startStopwatch,
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
          <Dialog.Trigger asChild onClick={pauseStopwatch}>
            <ActionButton icon={<ImCheckmark />} iconSize={IM_ICON_SIZE} />
          </Dialog.Trigger>
        </ActionTooltip>
      }
    />
  );
};
// #endregion

// #region Restart Puzzle Button
const getRestartedBoardState = (rawBoardState: RawBoardState): BoardState => {
  const restartedBoardState = buildBoardState(rawBoardState);
  return restartedBoardState;
};

const handleRestartPuzzleConfirmation = (
  rawBoardState: RawBoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const restartedBoardState = getRestartedBoardState(rawBoardState);
  const newPuzzleHistory = {
    currentBoardStateIndex: 0,
    boardStateHistory: [restartedBoardState],
  };
  setPuzzleHistory(newPuzzleHistory);
};

type RestartPuzzleDialogFooterProps = {
  rawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RestartPuzzleDialogFooter = ({
  rawBoardState,
  setPuzzleHistory,
}: RestartPuzzleDialogFooterProps) => {
  const { resetStopwatch, startStopwatch, startStopwatchIfEnabled } =
    useSudokuStopwatch();

  return (
    <Dialog.Footer justifyContent="center">
      <Stack direction={{ base: "column-reverse", sm: "row" }}>
        <Dialog.ActionTrigger asChild>
          <Button
            colorPalette="gray"
            variant="outline"
            onClick={startStopwatchIfEnabled}
          >
            Cancel
          </Button>
        </Dialog.ActionTrigger>

        <Dialog.ActionTrigger asChild>
          <Button
            colorPalette="blue"
            onClick={() => {
              resetStopwatch();
              handleRestartPuzzleConfirmation(rawBoardState, setPuzzleHistory);
            }}
          >
            <MdRestartAlt /> Restart
          </Button>
        </Dialog.ActionTrigger>

        <Dialog.ActionTrigger asChild>
          <Button
            colorPalette="blue"
            onClick={() => {
              startStopwatch();
              handleRestartPuzzleConfirmation(rawBoardState, setPuzzleHistory);
            }}
          >
            <MdRestartAlt /> + <ImStopwatch /> Keep Time
          </Button>
        </Dialog.ActionTrigger>
      </Stack>
    </Dialog.Footer>
  );
};

type RestartPuzzleButtonProps = {
  rawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const RestartPuzzleButton = ({
  rawBoardState,
  setPuzzleHistory,
}: RestartPuzzleButtonProps) => {
  const { pauseStopwatch } = useSudokuStopwatch();

  return (
    <ActionDialog
      dialogBodyText="Are you sure you want to restart the puzzle? All progress will be lost!"
      dialogFooter={
        <RestartPuzzleDialogFooter
          rawBoardState={rawBoardState}
          setPuzzleHistory={setPuzzleHistory}
        />
      }
      dialogTitleText="Confirm Restart"
      dialogTrigger={
        <ActionTooltip tooltipText="Restart the puzzle">
          <Dialog.Trigger asChild onClick={pauseStopwatch}>
            <ActionButton icon={<MdRestartAlt />} iconSize={MD_ICON_SIZE} />
          </Dialog.Trigger>
        </ActionTooltip>
      }
    />
  );
};
// #endregion

type PuzzleActionsProps = {
  puzzleHistory: PuzzleHistory;
  rawBoardState: RawBoardState;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const PuzzleActions = ({
  puzzleHistory,
  rawBoardState,
  setPuzzleHistory,
}: PuzzleActionsProps) => {
  return (
    <SimpleGrid
      columnGap={{ base: "0.5", lg: "3" }}
      columns={{ base: 1, lg: 2 }}
      maxWidth="12.75rem"
      rowGap={{ base: "0.125rem", md: "0.2875rem" }}
    >
      <NewPuzzleButton />
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
        rawBoardState={rawBoardState}
        setPuzzleHistory={setPuzzleHistory}
      />
    </SimpleGrid>
  );
};
