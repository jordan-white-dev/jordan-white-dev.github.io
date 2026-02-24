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
  type InputMode,
  type PuzzleHistory,
  type SudokuBoardState,
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
  buttonColor: MarkupColor;
  tooltipText: string;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const ColorButton = ({
  buttonColor,
  tooltipText,
  setCurrentSudokuBoard,
  setPuzzleHistory,
}: ColorButtonProps) => {
  const handleColorPadInput = () => {
    setCurrentSudokuBoard((currentSudokuBoard) => {
      const updatedSudokuBoard = currentSudokuBoard.map((boardCell) => {
        return boardCell.isSelected
          ? {
              ...boardCell,
              cellContent: {
                ...boardCell.cellContent,
                markupColor: buttonColor,
              },
            }
          : boardCell;
      });

      setPuzzleHistory((currentPuzzleHistory) => [
        ...currentPuzzleHistory,
        updatedSudokuBoard,
      ]);

      return updatedSudokuBoard;
    });
  };

  return (
    <GridItem colSpan={2} height={COLOR_SWATCH_SIZE} width={COLOR_SWATCH_SIZE}>
      <Tooltip content={tooltipText}>
        <ColorSwatch
          height={COLOR_SWATCH_SIZE}
          rounded="md"
          value={buttonColor}
          width={COLOR_SWATCH_SIZE}
          onClick={handleColorPadInput}
        />
      </Tooltip>
    </GridItem>
  );
};
// #endregion

const colorButtonTooltipTexts = {
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
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};
const ColorPad = ({
  setCurrentSudokuBoard,
  setPuzzleHistory,
}: ColorPadProps) => (
  <>
    {markupColors.map((markupColor) => (
      <ColorButton
        buttonColor={markupColor}
        key={markupColor}
        setCurrentSudokuBoard={setCurrentSudokuBoard}
        setPuzzleHistory={setPuzzleHistory}
        tooltipText={colorButtonTooltipTexts[markupColor]}
      />
    ))}
  </>
);
// #endregion

// #region Number Pad

// #region Number Button
type NumberButtonProps = {
  buttonValue: SudokuDigit;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const NumberButton = ({
  buttonValue,
  setCurrentSudokuBoard,
  setPuzzleHistory,
}: NumberButtonProps) => {
  const handleNumberPadInput = () => {
    setCurrentSudokuBoard((currentSudokuBoard) => {
      const updatedSudokuBoard = currentSudokuBoard.map((boardCell) => {
        const isValidInputCell =
          boardCell.isSelected && !("startingDigit" in boardCell.cellContent);

        return isValidInputCell
          ? {
              ...boardCell,
              cellContent: {
                playerDigit: buttonValue,
              },
            }
          : boardCell;
      });

      setPuzzleHistory((currentPuzzleHistory) => [
        ...currentPuzzleHistory,
        updatedSudokuBoard,
      ]);

      return updatedSudokuBoard;
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
          {buttonValue}
        </IconButton>
      </Square>
    </GridItem>
  );
};
// #endregion

type NumberPadProps = {
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const NumberPad = ({
  setCurrentSudokuBoard,
  setPuzzleHistory,
}: NumberPadProps) => (
  <>
    {sudokuDigits.map((digit) => (
      <NumberButton
        key={digit}
        buttonValue={digit}
        setCurrentSudokuBoard={setCurrentSudokuBoard}
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
          onCheckedChange={(e) => setIsMultiselectMode(e.checked)}
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

// #region Delete Button
const DeleteButton = () => (
  <GridItem colSpan={3}>
    <Tooltip
      content="Delete content from the selected cells"
      positioning={{ placement: "bottom" }}
    >
      <IconButton
        aria-label="Delete"
        color="white"
        colorPalette="blue"
        rounded="md"
        size={ICON_BUTTON_SIZE}
        textStyle={ICON_BUTTON_TEXT_STYLE}
        width="full"
      >
        <Icon height={ICON_SIZE} width={ICON_SIZE}>
          <FiDelete />
        </Icon>
      </IconButton>
    </Tooltip>
  </GridItem>
);
// #endregion

type InputPadProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const InputPad = ({
  inputMode,
  isMultiselectMode,
  setCurrentSudokuBoard,
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
        setCurrentSudokuBoard={setCurrentSudokuBoard}
        setPuzzleHistory={setPuzzleHistory}
      />
    ) : (
      <NumberPad
        setCurrentSudokuBoard={setCurrentSudokuBoard}
        setPuzzleHistory={setPuzzleHistory}
      />
    )}

    <MultiselectSwitch
      isMultiselectMode={isMultiselectMode}
      setIsMultiselectMode={setIsMultiselectMode}
    />
    <DeleteButton />
  </SimpleGrid>
);
