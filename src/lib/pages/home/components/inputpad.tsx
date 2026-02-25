import {
  ColorSwatch,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
  Square,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { FiDelete } from "react-icons/fi";
import { GrCheckbox, GrMultiple } from "react-icons/gr";

import {
  type BoardState,
  type CellState,
  type InputMode,
  type PlayerDigit,
  type PuzzleHistory,
  type SudokuDigit,
  sudokuDigits,
} from "..";
import {
  MARKUP_COLOR_GRAY,
  MARKUP_COLOR_GREEN,
  MARKUP_COLOR_ORANGE,
  MARKUP_COLOR_RED,
  MARKUP_COLOR_SILVER,
  MARKUP_COLOR_TAN,
  MARKUP_COLOR_VIOLET,
  MARKUP_COLOR_WHITE,
  MARKUP_COLOR_YELLOW,
  type MarkupColor,
  markupColors,
} from "./svgs";
import { Tooltip } from "./tooltip";

// #region CSS Properties
const COLOR_SWATCH_SIZE: IconProps["width"] = {
  base: "2.105rem",
  sm: "11",
  md: "16",
};
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
// #endregion

// #region Color Pad

// #region Color Button
type ColorButtonProps = {
  markupColor: MarkupColor;
  puzzleHistory: PuzzleHistory;
  tooltipText: string;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const ColorButton = ({
  markupColor,
  puzzleHistory,
  tooltipText,
  setPuzzleHistory,
}: ColorButtonProps) => {
  const handleColorPadInput = () => {
    const currentBoardState =
      puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

    const doAllSelectedCellsHaveTheMarkupColor = currentBoardState
      .filter((cellState) => cellState.isSelected)
      .map((cellState) => cellState.markupColors[0])
      .every((color) => color === markupColor);

    const newBoardState: BoardState = currentBoardState.map((cellState) => {
      const newBlankColorCellState: CellState = {
        ...cellState,
        markupColors: [""],
      };

      const newMarkupColorCellState: CellState = {
        ...cellState,
        markupColors: [markupColor],
      };

      return cellState.isSelected
        ? doAllSelectedCellsHaveTheMarkupColor
          ? newBlankColorCellState
          : newMarkupColorCellState
        : cellState;
    });

    setPuzzleHistory((currentPuzzleHistory) => {
      const newBoardStateIndex =
        currentPuzzleHistory.currentBoardStateIndex + 1;

      const newBoardStateHistory = [
        ...currentPuzzleHistory.boardStateHistory.slice(0, newBoardStateIndex),
        newBoardState,
      ];

      const newPuzzleHistory = {
        currentBoardStateIndex: newBoardStateIndex,
        boardStateHistory: newBoardStateHistory,
      };

      return newPuzzleHistory;
    });
  };

  return (
    <GridItem colSpan={2} height={COLOR_SWATCH_SIZE} width={COLOR_SWATCH_SIZE}>
      <Tooltip content={tooltipText}>
        <ColorSwatch
          height={COLOR_SWATCH_SIZE}
          rounded="md"
          value={markupColor}
          width={COLOR_SWATCH_SIZE}
          onClick={handleColorPadInput}
        />
      </Tooltip>
    </GridItem>
  );
};
// #endregion

const colorPadTooltipTexts = {
  [MARKUP_COLOR_GRAY]: "Gray",
  [MARKUP_COLOR_SILVER]: "Silver",
  [MARKUP_COLOR_WHITE]: "White",
  [MARKUP_COLOR_VIOLET]: "Violet",
  [MARKUP_COLOR_RED]: "Red",
  [MARKUP_COLOR_TAN]: "Tan",
  [MARKUP_COLOR_ORANGE]: "Orange",
  [MARKUP_COLOR_YELLOW]: "Yellow",
  [MARKUP_COLOR_GREEN]: "Green",
};

type ColorPadProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};
const ColorPad = ({ puzzleHistory, setPuzzleHistory }: ColorPadProps) => (
  <>
    {markupColors.map((markupColor) => (
      <ColorButton
        key={markupColor}
        markupColor={markupColor}
        puzzleHistory={puzzleHistory}
        tooltipText={colorPadTooltipTexts[markupColor]}
        setPuzzleHistory={setPuzzleHistory}
      />
    ))}
  </>
);
// #endregion

// #region Number Pad

// #region Number Button
type NumberButtonProps = {
  displayValue: SudokuDigit;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const NumberButton = ({
  displayValue,
  puzzleHistory,
  setPuzzleHistory,
}: NumberButtonProps) => {
  const handleNumberPadInput = () => {
    const currentBoardState =
      puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

    const doAllSelectedCellsEqualTheNumberInput = currentBoardState
      .filter(
        (cellState): cellState is CellState & { cellContent: PlayerDigit } =>
          cellState.isSelected && "playerDigit" in cellState.cellContent,
      )
      .map((cellState) => cellState.cellContent.playerDigit)
      .every((playerDigit) => playerDigit === displayValue);

    const newBoardState: BoardState = currentBoardState.map((cellState) => {
      const isValidInputCell =
        cellState.isSelected && !("startingDigit" in cellState.cellContent);

      const newDisplayValueCellState: CellState = {
        ...cellState,
        cellContent: {
          playerDigit: displayValue,
        },
      };

      const newBlankValueCellState: CellState = {
        ...cellState,
        cellContent: {
          playerDigit: "",
        },
      };

      const newCellState = isValidInputCell
        ? doAllSelectedCellsEqualTheNumberInput
          ? newBlankValueCellState
          : newDisplayValueCellState
        : cellState;

      return newCellState;
    });

    setPuzzleHistory((currentPuzzleHistory) => {
      const newBoardStateIndex =
        currentPuzzleHistory.currentBoardStateIndex + 1;

      const newBoardStateHistory = [
        ...currentPuzzleHistory.boardStateHistory.slice(0, newBoardStateIndex),
        newBoardState,
      ];

      const newPuzzleHistory = {
        currentBoardStateIndex: newBoardStateIndex,
        boardStateHistory: newBoardStateHistory,
      };

      return newPuzzleHistory;
    });
  };

  return (
    <GridItem colSpan={2}>
      <Square aspectRatio="square">
        <IconButton
          aspectRatio="square"
          color="white"
          colorPalette="blue"
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={ICON_BUTTON_TEXT_STYLE}
          onClick={handleNumberPadInput}
        >
          {displayValue}
        </IconButton>
      </Square>
    </GridItem>
  );
};
// #endregion

type NumberPadProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const NumberPad = ({ puzzleHistory, setPuzzleHistory }: NumberPadProps) => (
  <>
    {sudokuDigits.map((digit) => (
      <NumberButton
        displayValue={digit}
        key={digit}
        puzzleHistory={puzzleHistory}
        setPuzzleHistory={setPuzzleHistory}
      />
    ))}
  </>
);
// #endregion

// #region Multiselect Switch
type MultiselectSwitchProps = {
  isMultiselectMode: boolean;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
};

const MultiselectSwitch = ({
  isMultiselectMode,
  setIsMultiselectMode,
}: MultiselectSwitchProps) => (
  <GridItem
    alignContent="center"
    border={{ sm: "2px solid" }}
    borderColor={{ sm: "blue.border" }}
    colSpan={3}
    height="full"
    rounded="md"
    width="full"
  >
    <Tooltip content="Multiple cells can be selected while this is toggled">
      <Stack alignItems="center" direction="column" gap="1">
        <Switch.Root
          checked={isMultiselectMode}
          colorPalette="blue"
          size="lg"
          onCheckedChange={(event) => setIsMultiselectMode(event.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<Icon as={GrCheckbox} />}>
              <Icon as={GrMultiple} />
            </Switch.Indicator>
          </Switch.Control>
        </Switch.Root>
        <Text
          alignSelf="center"
          fontWeight="semibold"
          hideBelow="md"
          justifySelf="center"
        >
          Multiselect
        </Text>
      </Stack>
    </Tooltip>
  </GridItem>
);
// #endregion

// #region Clear Button
type ClearButtonProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const ClearButton = ({ puzzleHistory, setPuzzleHistory }: ClearButtonProps) => {
  const handleClearButton = () => {
    const currentBoardState =
      puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

    const newBoardState: BoardState = currentBoardState.map((cellState) => {
      const isNonStartingDigitCell = !(
        "startingDigit" in cellState.cellContent
      );

      const newStartingDigitCellState: CellState = {
        ...cellState,
        markupColors: [""],
      };

      const newPlayerDigitCellState: CellState = {
        ...cellState,
        cellContent: {
          playerDigit: "",
        },
        markupColors: [""],
      };

      const newCellState = cellState.isSelected
        ? isNonStartingDigitCell
          ? newPlayerDigitCellState
          : newStartingDigitCellState
        : cellState;

      return newCellState;
    });

    setPuzzleHistory((currentPuzzleHistory) => {
      const newBoardStateIndex =
        currentPuzzleHistory.currentBoardStateIndex + 1;

      const newBoardStateHistory = [
        ...currentPuzzleHistory.boardStateHistory.slice(0, newBoardStateIndex),
        newBoardState,
      ];

      const newPuzzleHistory = {
        currentBoardStateIndex: newBoardStateIndex,
        boardStateHistory: newBoardStateHistory,
      };

      return newPuzzleHistory;
    });
  };

  return (
    <GridItem colSpan={3}>
      <Tooltip
        content="Clear the selected cells"
        positioning={{ placement: "bottom" }}
      >
        <IconButton
          color="white"
          colorPalette="blue"
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={ICON_BUTTON_TEXT_STYLE}
          width="full"
          onClick={handleClearButton}
        >
          <Icon height={ICON_SIZE} width={ICON_SIZE}>
            <FiDelete />
          </Icon>
        </IconButton>
      </Tooltip>
    </GridItem>
  );
};
// #endregion

type InputPadProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
  puzzleHistory: PuzzleHistory;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const InputPad = ({
  inputMode,
  isMultiselectMode,
  puzzleHistory,
  setIsMultiselectMode,
  setPuzzleHistory,
}: InputPadProps) => (
  <SimpleGrid
    columns={6}
    gap={{ base: "0.1874rem", sm: "1", md: "1.5" }}
    height="fit-content"
  >
    {inputMode === "Color" ? (
      <ColorPad
        puzzleHistory={puzzleHistory}
        setPuzzleHistory={setPuzzleHistory}
      />
    ) : (
      <NumberPad
        puzzleHistory={puzzleHistory}
        setPuzzleHistory={setPuzzleHistory}
      />
    )}

    <MultiselectSwitch
      isMultiselectMode={isMultiselectMode}
      setIsMultiselectMode={setIsMultiselectMode}
    />
    <ClearButton
      puzzleHistory={puzzleHistory}
      setPuzzleHistory={setPuzzleHistory}
    />
  </SimpleGrid>
);
