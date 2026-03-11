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
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { FiDelete } from "react-icons/fi";
import { GrCheckbox, GrMultiple } from "react-icons/gr";
import SuperExpressive from "super-expressive";

import {
  isMarkupDigitsInCellContent,
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
  isStartingOrPlayerDigitInCellContent,
} from "@/lib/shared/constants";
import {
  type BoardState,
  type CellState,
  flippedKeypadMarkupColors,
  flippedKeypadSudokuDigits,
  type KeypadMode,
  MARKUP_COLOR_BLUE,
  MARKUP_COLOR_GRAY,
  MARKUP_COLOR_GREEN,
  MARKUP_COLOR_ORANGE,
  MARKUP_COLOR_PINK,
  MARKUP_COLOR_PURPLE,
  MARKUP_COLOR_RED,
  MARKUP_COLOR_WHITE,
  MARKUP_COLOR_YELLOW,
  type MarkupColor,
  type MarkupDigits,
  type MarkupDigitsCellContent,
  markupColors,
  type PuzzleHistory,
  type SudokuDigit,
  sudokuDigits,
} from "@/lib/shared/types";

import { useUserSettings } from "..";
import { Tooltip } from "./tooltip";

// #region CSS Properties
const COLOR_SWATCH_SIZE: IconProps["width"] = {
  base: "8",
  sm: "11",
  md: "16",
};
const ICON_SIZE: IconProps["width"] = { base: "6", sm: "8", md: "11" };
const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
  base: "xs",
  sm: "lg",
  md: "2xl",
};
const ICON_BUTTON_TEXT_STYLE_DIGIT: IconButtonProps["textStyle"] = {
  base: "lg",
  sm: "3xl",
  md: "5xl",
};
const ICON_BUTTON_TEXT_STYLE_NONDIGIT: IconButtonProps["textStyle"] = {
  base: "xs",
  sm: "lg",
  md: "2xl",
};
// #endregion

// #region Shared
const handleSetPuzzleHistory = (
  newBoardState: BoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((previousPuzzleHistory) => {
    const newBoardStateIndex = previousPuzzleHistory.currentBoardStateIndex + 1;

    const newBoardStateHistory = [
      ...previousPuzzleHistory.boardStateHistory.slice(0, newBoardStateIndex),
      newBoardState,
    ];

    const newPuzzleHistory = {
      currentBoardStateIndex: newBoardStateIndex,
      boardStateHistory: newBoardStateHistory,
    };

    return newPuzzleHistory;
  });
};

const getUpdatedCellStateWithRemovedMarkupDigit = (
  markupType: Extract<KeypadMode, "Center" | "Corner">,
  buttonValue: SudokuDigit,
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
): CellState => {
  const previousCellContent = previousCellState.cellContent;

  if (!isMarkupDigitsInCellContent(previousCellContent))
    return previousCellState;

  const previousMarkupsNotMatchingTheButtonValue = previousMarkups.filter(
    (previousMarkup) => previousMarkup !== buttonValue,
  );

  const updatedMarkups: [""] | Array<SudokuDigit> =
    previousMarkupsNotMatchingTheButtonValue.length > 0
      ? previousMarkupsNotMatchingTheButtonValue
      : [""];

  const centerMarkups: MarkupDigits =
    markupType === "Center"
      ? updatedMarkups
      : previousCellContent.centerMarkups;

  const cornerMarkups: MarkupDigits =
    markupType === "Corner"
      ? updatedMarkups
      : previousCellContent.cornerMarkups;

  const updatedCellContentAfterRemoveCheck: MarkupDigitsCellContent = {
    centerMarkups: centerMarkups,
    cornerMarkups: cornerMarkups,
  };

  const updatedCellState: CellState = {
    ...previousCellState,
    cellContent: updatedCellContentAfterRemoveCheck,
  };

  return updatedCellState;
};

const getUpdatedCellStateWithAddedMarkupDigit = (
  markupType: Extract<KeypadMode, "Center" | "Corner">,
  buttonValue: SudokuDigit,
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
) => {
  const previousCellContent = previousCellState.cellContent;

  if (!isMarkupDigitsInCellContent(previousCellContent))
    return previousCellState;

  const updatedMarkups = previousMarkups.includes(buttonValue)
    ? previousMarkups
    : [...previousMarkups, buttonValue];

  const centerMarkups: MarkupDigits =
    markupType === "Center"
      ? updatedMarkups
      : previousCellContent.centerMarkups;

  const cornerMarkups: MarkupDigits =
    markupType === "Corner"
      ? updatedMarkups
      : previousCellContent.cornerMarkups;

  const updatedCellContentAfterAddCheck: MarkupDigitsCellContent = {
    centerMarkups: centerMarkups,
    cornerMarkups: cornerMarkups,
  };

  const updatedCellState: CellState = {
    ...previousCellState,
    cellContent: updatedCellContentAfterAddCheck,
  };

  return updatedCellState;
};

const getUpdatedCellStateWithAnEmptyMarkupType = (
  markupType: Extract<KeypadMode, "Center" | "Corner">,
  buttonValue: SudokuDigit,
  previousCellState: CellState,
) => {
  const newMarkupDigitsCellContent: MarkupDigitsCellContent =
    markupType === "Center"
      ? {
          centerMarkups: [buttonValue],
          cornerMarkups: [""],
        }
      : {
          centerMarkups: [""],
          cornerMarkups: [buttonValue],
        };

  const newMarkupDigitsCellState: CellState = {
    ...previousCellState,
    cellContent: newMarkupDigitsCellContent,
  };

  return newMarkupDigitsCellState;
};

const markupDigitsCellStateUpdater = (
  buttonValue: SudokuDigit,
  markupType: Extract<KeypadMode, "Center" | "Corner">,
  previousCellState: CellState,
  shouldMarkupDigitBeRemoved: boolean,
) => {
  if (!previousCellState.isSelected) return previousCellState;

  const previousCellContent = previousCellState.cellContent;

  const isNotAStartingDigit =
    !isStartingDigitInCellContent(previousCellContent);

  const isABlankPlayerDigit =
    isPlayerDigitInCellContent(previousCellContent) &&
    previousCellContent.playerDigit === "";

  const isValidInputCell =
    isNotAStartingDigit &&
    (isABlankPlayerDigit || isMarkupDigitsInCellContent(previousCellContent));

  if (!isValidInputCell) return previousCellState;

  if (isMarkupDigitsInCellContent(previousCellContent)) {
    const previousMarkups =
      markupType === "Center"
        ? previousCellContent.centerMarkups.filter(
            (previousCenterMarkup) => previousCenterMarkup !== "",
          )
        : previousCellContent.cornerMarkups.filter(
            (previousCornerMarkup) => previousCornerMarkup !== "",
          );

    if (shouldMarkupDigitBeRemoved)
      return getUpdatedCellStateWithRemovedMarkupDigit(
        markupType,
        buttonValue,
        previousCellState,
        previousMarkups,
      );

    return getUpdatedCellStateWithAddedMarkupDigit(
      markupType,
      buttonValue,
      previousCellState,
      previousMarkups,
    );
  } else if (isPlayerDigitInCellContent(previousCellContent)) {
    return getUpdatedCellStateWithAnEmptyMarkupType(
      markupType,
      buttonValue,
      previousCellState,
    );
  }

  return previousCellState;
};

const areAllSelectedCellsStartingPlayerOrContainButtonValueAsMarkup = (
  buttonValue: SudokuDigit,
  markupType: Extract<KeypadMode, "Center" | "Corner">,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState.every(
    (previousCellState) =>
      !previousCellState.isSelected ||
      isStartingOrPlayerDigitInCellContent(previousCellState.cellContent) ||
      (isMarkupDigitsInCellContent(previousCellState.cellContent) &&
      markupType === "Center"
        ? previousCellState.cellContent.centerMarkups
            .filter((centerMarkup) => centerMarkup !== "")
            .includes(buttonValue)
        : previousCellState.cellContent.cornerMarkups
            .filter((cornerMarkup) => cornerMarkup !== "")
            .includes(buttonValue)),
  );
// #endregion

// #region Color Pad

// #region Color Button

// #region Color Pad Input
const isSudokuDigit = (
  colorValue: MarkupColor | SudokuDigit,
): colorValue is SudokuDigit =>
  sudokuDigits.includes(colorValue as SudokuDigit);

const doAllSelectedCellsHaveTheButtonColorAsAMarkup = (
  buttonColor: MarkupColor,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState
    .filter((previousCellState) => previousCellState.isSelected)
    .every((previousCellState) =>
      previousCellState.markupColors
        .filter((previousMarkupColor) => previousMarkupColor !== "")
        .includes(buttonColor),
    );

const getUpdatedCellStateWithRemovedMarkupColor = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  previousMarkupColors: Array<MarkupColor>,
) => {
  const markupColorsCellContentAfterRemoveCheck: Array<MarkupColor> =
    previousMarkupColors.filter(
      (previousMarkupColor) => previousMarkupColor !== markupColor,
    );

  if (markupColorsCellContentAfterRemoveCheck.length > 0) {
    const markupColorsCellStateAfterRemoveCheck: CellState = {
      ...previousCellState,
      markupColors: markupColorsCellContentAfterRemoveCheck,
    };

    return markupColorsCellStateAfterRemoveCheck;
  }

  const markupColorsCellStateAfterRemoveCheck: CellState = {
    ...previousCellState,
    markupColors: [""],
  };

  return markupColorsCellStateAfterRemoveCheck;
};

const getUpdatedCellStateWithAddedMarkupColor = (
  markupColor: MarkupColor,
  previousCellState: CellState,
  previousMarkupColors: Array<MarkupColor>,
) => {
  const markupColorsCellContentAfterAddCheck: Array<MarkupColor> =
    previousMarkupColors.includes(markupColor)
      ? previousMarkupColors
      : [...previousMarkupColors, markupColor];

  const markupColorsCellStateAfterAddCheck: CellState = {
    ...previousCellState,
    markupColors: markupColorsCellContentAfterAddCheck,
  };

  return markupColorsCellStateAfterAddCheck;
};

const markupColorCellStateUpdater = (
  buttonColor: MarkupColor,
  previousCellState: CellState,
  shouldMarkupColorBeRemoved: boolean,
) => {
  if (!previousCellState.isSelected) return previousCellState;

  const previousMarkupColors = previousCellState.markupColors.filter(
    (previousMarkupColor) => previousMarkupColor !== "",
  );

  return shouldMarkupColorBeRemoved
    ? getUpdatedCellStateWithRemovedMarkupColor(
        buttonColor,
        previousCellState,
        previousMarkupColors,
      )
    : getUpdatedCellStateWithAddedMarkupColor(
        buttonColor,
        previousCellState,
        previousMarkupColors,
      );
};

const handleColorPadInput = (
  colorValue: MarkupColor | SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const buttonColor: MarkupColor = isSudokuDigit(colorValue)
    ? markupColors[sudokuDigits.indexOf(colorValue)]
    : colorValue;

  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupColorBeRemoved =
    doAllSelectedCellsHaveTheButtonColorAsAMarkup(
      buttonColor,
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      markupColorCellStateUpdater(
        buttonColor,
        previousCellState,
        shouldMarkupColorBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

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
}: ColorButtonProps) => (
  <GridItem colSpan={2} height={COLOR_SWATCH_SIZE} width={COLOR_SWATCH_SIZE}>
    <Tooltip content={tooltipText}>
      <ColorSwatch
        height={COLOR_SWATCH_SIZE}
        rounded="md"
        value={markupColor}
        width={COLOR_SWATCH_SIZE}
        onClick={() =>
          handleColorPadInput(markupColor, puzzleHistory, setPuzzleHistory)
        }
      />
    </Tooltip>
  </GridItem>
);
// #endregion

const colorPadTooltipTexts = {
  [MARKUP_COLOR_GRAY]: "Gray (1)",
  [MARKUP_COLOR_WHITE]: "White (2)",
  [MARKUP_COLOR_PINK]: "Pink (3)",
  [MARKUP_COLOR_RED]: "Red (4)",
  [MARKUP_COLOR_ORANGE]: "Orange (5)",
  [MARKUP_COLOR_YELLOW]: "Yellow (6)",
  [MARKUP_COLOR_GREEN]: "Green (7)",
  [MARKUP_COLOR_BLUE]: "Blue (8)",
  [MARKUP_COLOR_PURPLE]: "Purple (9)",
};

type ColorPadProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const ColorPad = ({ puzzleHistory, setPuzzleHistory }: ColorPadProps) => {
  const { userSettings } = useUserSettings();
  const markupColorsInOrder = userSettings.flipKeypad
    ? flippedKeypadMarkupColors
    : markupColors;

  return (
    <>
      {markupColorsInOrder.map((markupColor) => (
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
};
// #endregion

// #region Number Pad

// #region Number Button

// #region Digit Input
const playerDigitCellStateUpdater = (
  buttonValue: SudokuDigit,
  previousCellState: CellState,
  shouldPlayerDigitBeRemoved: boolean,
) => {
  const isValidInputCell =
    previousCellState.isSelected &&
    !isStartingDigitInCellContent(previousCellState.cellContent);
  if (!isValidInputCell) return previousCellState;

  if (shouldPlayerDigitBeRemoved) {
    const emptyPlayerDigitCellState: CellState = {
      ...previousCellState,
      cellContent: {
        playerDigit: "",
      },
    };
    return emptyPlayerDigitCellState;
  }

  const addedPlayerDigitCellState: CellState = {
    ...previousCellState,
    cellContent: {
      playerDigit: buttonValue,
    },
  };
  return addedPlayerDigitCellState;
};

const areAllSelectedCellsStartingOrContainButtonValueAsPlayerDigit = (
  buttonValue: SudokuDigit,
  previousBoardState: BoardState,
): boolean =>
  previousBoardState.every(
    (previousCellState) =>
      !previousCellState.isSelected ||
      isStartingDigitInCellContent(previousCellState.cellContent) ||
      (isPlayerDigitInCellContent(previousCellState.cellContent) &&
        previousCellState.cellContent.playerDigit === buttonValue),
  );

const handleDigitInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldPlayerDigitBeRemoved =
    areAllSelectedCellsStartingOrContainButtonValueAsPlayerDigit(
      buttonValue,
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      playerDigitCellStateUpdater(
        buttonValue,
        previousCellState,
        shouldPlayerDigitBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

// #region Center Markup Input
const handleCenterMarkupInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainButtonValueAsMarkup(
      buttonValue,
      "Center",
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      markupDigitsCellStateUpdater(
        buttonValue,
        "Center",
        previousCellState,
        shouldMarkupDigitBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

// #region Corner Markup Input
const handleCornerMarkupInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const shouldMarkupDigitBeRemoved =
    areAllSelectedCellsStartingPlayerOrContainButtonValueAsMarkup(
      buttonValue,
      "Corner",
      previousBoardState,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) =>
      markupDigitsCellStateUpdater(
        buttonValue,
        "Corner",
        previousCellState,
        shouldMarkupDigitBeRemoved,
      ),
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

type NumberButtonProps = {
  alignItems?: IconButtonProps["alignItems"];
  buttonValue: SudokuDigit;
  justifyContent?: IconButtonProps["justifyContent"];
  padding?: IconButtonProps["padding"];
  textStyle: IconButtonProps["textStyle"];
  onClick: () => void;
};

const NumberButton = ({
  alignItems,
  buttonValue,
  justifyContent,
  padding,
  textStyle,
  onClick,
}: NumberButtonProps) => (
  <GridItem colSpan={2} key={buttonValue}>
    <Tooltip content={buttonValue}>
      <Square aspectRatio="square">
        <IconButton
          aspectRatio="square"
          color="white"
          colorPalette="blue"
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={textStyle}
          onClick={onClick}
          {...(alignItems && { alignItems })}
          {...(justifyContent && { justifyContent })}
          {...(padding && { padding })}
        >
          {buttonValue}
        </IconButton>
      </Square>
    </Tooltip>
  </GridItem>
);
// #endregion

const getAlignItems = (
  buttonValueAsNumber: number,
): IconButtonProps["alignItems"] => {
  if (buttonValueAsNumber <= 3) return "start";
  else if (buttonValueAsNumber <= 6) return "center";
  else return "end";
};

const getJustifyContent = (buttonValueAsNumber: number) => {
  if (buttonValueAsNumber % 3 === 1) return "start";
  else if (buttonValueAsNumber % 3 === 2) return "center";
  else return "end";
};

type NumberPadProps = {
  keypadMode: KeypadMode;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const NumberPad = ({
  keypadMode,
  puzzleHistory,
  setPuzzleHistory,
}: NumberPadProps) => {
  const { userSettings } = useUserSettings();
  const sudokuDigitsInOrder = userSettings.flipKeypad
    ? flippedKeypadSudokuDigits
    : sudokuDigits;

  return (
    <>
      {sudokuDigitsInOrder.map((buttonValue, index) => {
        if (keypadMode === "Digit") {
          return (
            <NumberButton
              buttonValue={buttonValue}
              textStyle={ICON_BUTTON_TEXT_STYLE_DIGIT}
              onClick={() =>
                handleDigitInput(buttonValue, puzzleHistory, setPuzzleHistory)
              }
            />
          );
        } else if (keypadMode === "Center")
          return (
            <NumberButton
              buttonValue={buttonValue}
              textStyle={ICON_BUTTON_TEXT_STYLE_NONDIGIT}
              onClick={() =>
                handleCenterMarkupInput(
                  buttonValue,
                  puzzleHistory,
                  setPuzzleHistory,
                )
              }
            />
          );
        else {
          return (
            <NumberButton
              alignItems={getAlignItems(index + 1)}
              buttonValue={buttonValue}
              justifyContent={getJustifyContent(index + 1)}
              padding={{ base: "1", md: "1.5" }}
              textStyle={ICON_BUTTON_TEXT_STYLE_NONDIGIT}
              onClick={() =>
                handleCornerMarkupInput(
                  buttonValue,
                  puzzleHistory,
                  setPuzzleHistory,
                )
              }
            />
          );
        }
      })}
    </>
  );
};
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
const handleClearButton = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) => {
      if (!previousCellState.isSelected) return previousCellState;

      if (isStartingDigitInCellContent(previousCellState.cellContent)) {
        const newStartingDigitCellState: CellState = {
          ...previousCellState,
          markupColors: [""],
        };

        return newStartingDigitCellState;
      }

      const newPlayerDigitCellState: CellState = {
        ...previousCellState,
        cellContent: {
          playerDigit: "",
        },
        markupColors: [""],
      };

      return newPlayerDigitCellState;
    },
  );

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};

type ClearButtonProps = {
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const ClearButton = ({ puzzleHistory, setPuzzleHistory }: ClearButtonProps) => (
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
        textStyle={ICON_BUTTON_TEXT_STYLE_DIGIT}
        width="full"
        onClick={() => handleClearButton(puzzleHistory, setPuzzleHistory)}
      >
        <Icon height={ICON_SIZE} width={ICON_SIZE}>
          <FiDelete />
        </Icon>
      </IconButton>
    </Tooltip>
  </GridItem>
);
// #endregion

type KeypadProps = {
  isMultiselectMode: boolean;
  keypadMode: KeypadMode;
  puzzleHistory: PuzzleHistory;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const Keypad = ({
  isMultiselectMode,
  keypadMode,
  puzzleHistory,
  setIsMultiselectMode,
  setPuzzleHistory,
}: KeypadProps) => {
  useEffect(() => {
    const handleNumberKeyDown = (digit: SudokuDigit) => {
      switch (keypadMode) {
        case "Digit":
          handleDigitInput(digit, puzzleHistory, setPuzzleHistory);
          break;
        case "Center":
          handleCenterMarkupInput(digit, puzzleHistory, setPuzzleHistory);
          break;
        case "Corner":
          handleCornerMarkupInput(digit, puzzleHistory, setPuzzleHistory);
          break;
        case "Color":
          handleColorPadInput(digit, puzzleHistory, setPuzzleHistory);
          break;
        default:
          break;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const code = event.code;

      // Equivalent to: "/^Digit[1-9]$/"
      const validNumberCode = SuperExpressive()
        .startOfInput.string("Digit")
        .range("1", "9")
        .endOfInput.toRegex();

      if (validNumberCode.test(code)) {
        const digit = code.replace("Digit", "") as SudokuDigit;
        handleNumberKeyDown(digit);
      } else if (key === "Escape" || key === "Backspace" || key === "Delete") {
        handleClearButton(puzzleHistory, setPuzzleHistory);
      } else if (key.toLowerCase() === "m") {
        setIsMultiselectMode(
          (previousMultiselectMode) => !previousMultiselectMode,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keypadMode, puzzleHistory, setPuzzleHistory, setIsMultiselectMode]);

  return (
    <SimpleGrid
      columns={6}
      gap={{ base: "0.2916rem", sm: "1", md: "1.5" }}
      height="fit-content"
    >
      {keypadMode === "Color" ? (
        <ColorPad
          puzzleHistory={puzzleHistory}
          setPuzzleHistory={setPuzzleHistory}
        />
      ) : (
        <NumberPad
          keypadMode={keypadMode}
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
};
