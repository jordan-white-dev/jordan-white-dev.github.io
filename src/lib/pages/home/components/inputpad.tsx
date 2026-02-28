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
  type MarkupDigits,
  type PlayerDigit,
  type PuzzleHistory,
  type SudokuDigit,
  sudokuDigits,
} from "./puzzle";
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

// #region Handle Puzzle History
const handleSetPuzzleHistory = (
  newBoardState: BoardState,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  setPuzzleHistory((currentPuzzleHistory) => {
    const newBoardStateIndex = currentPuzzleHistory.currentBoardStateIndex + 1;

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
// #endregion

// #region Color Pad

// #region Color Button

// #region Color Pad Input
const getUpdatedMarkupColorsCellStateAfterRemoveCheck = (
  markupColor: MarkupColor,
  cellState: CellState,
  currentMarkupColors: Array<MarkupColor>,
) => {
  const markupColorsCellContentAfterRemoveCheck: Array<MarkupColor> =
    currentMarkupColors.filter((color) => color !== markupColor);

  const markupColorsCellStateAfterRemoveCheck: CellState = {
    ...cellState,
    markupColors:
      markupColorsCellContentAfterRemoveCheck.length > 0
        ? markupColorsCellContentAfterRemoveCheck
        : [""],
  };

  return markupColorsCellStateAfterRemoveCheck;
};

const getUpdatedMarkupColorsCellStateAfterAddCheck = (
  markupColor: MarkupColor,
  cellState: CellState,
  currentMarkupColors: Array<MarkupColor>,
) => {
  const markupColorsCellContentAfterAddCheck: Array<MarkupColor> =
    currentMarkupColors.includes(markupColor)
      ? currentMarkupColors
      : [...currentMarkupColors, markupColor];

  const markupColorsCellStateAfterAddCheck: CellState = {
    ...cellState,
    markupColors: markupColorsCellContentAfterAddCheck,
  };

  return markupColorsCellStateAfterAddCheck;
};

const handleColorPadInput = (
  markupColor: MarkupColor,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const doAllSelectedCellsHaveTheMarkupColorInput = currentBoardState
    .filter((cellState) => cellState.isSelected)
    .every((cellState) =>
      cellState.markupColors
        .filter((markupColor) => markupColor !== "")
        .includes(markupColor),
    );

  const newBoardState: BoardState = currentBoardState.map((cellState) => {
    if (!cellState.isSelected) return cellState;

    const currentMarkupColors = cellState.markupColors.filter(
      (markupColor) => markupColor !== "",
    );

    return doAllSelectedCellsHaveTheMarkupColorInput
      ? getUpdatedMarkupColorsCellStateAfterRemoveCheck(
          markupColor,
          cellState,
          currentMarkupColors,
        )
      : getUpdatedMarkupColorsCellStateAfterAddCheck(
          markupColor,
          cellState,
          currentMarkupColors,
        );
  });

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

// #region Digit Number Button

// #region Digit Input
const handleDigitInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const currentlySelectedCells = currentBoardState.filter(
    (cellState) => cellState.isSelected,
  );

  const existingPlayerDigitsInSelectedCells = currentBoardState
    .filter(
      (cellState): cellState is CellState & { cellContent: PlayerDigit } =>
        cellState.isSelected && "playerDigit" in cellState.cellContent,
    )
    .map((cellState) => cellState.cellContent.playerDigit);

  const areAllSelectedCellsPlayerDigits =
    existingPlayerDigitsInSelectedCells.length ===
    currentlySelectedCells.length;

  const doAllSelectedCellsEqualTheNumberInput =
    existingPlayerDigitsInSelectedCells.length > 0 &&
    existingPlayerDigitsInSelectedCells.every(
      (playerDigit) => playerDigit === buttonValue,
    );

  const newBoardState: BoardState = currentBoardState.map((cellState) => {
    const isValidInputCell =
      cellState.isSelected && !("startingDigit" in cellState.cellContent);
    if (!isValidInputCell) return cellState;

    const newBlankValueCellState: CellState = {
      ...cellState,
      cellContent: {
        playerDigit: "",
      },
    };

    const newPlayerDigitCellState: CellState = {
      ...cellState,
      cellContent: {
        playerDigit: buttonValue,
      },
    };

    return "playerDigit" in cellState.cellContent &&
      areAllSelectedCellsPlayerDigits &&
      doAllSelectedCellsEqualTheNumberInput
      ? newBlankValueCellState
      : newPlayerDigitCellState;
  });

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

type DigitNumberButtonProps = {
  buttonValue: SudokuDigit;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const DigitNumberButton = ({
  buttonValue,
  puzzleHistory,
  setPuzzleHistory,
}: DigitNumberButtonProps) => (
  <GridItem colSpan={2}>
    <Square aspectRatio="square">
      <IconButton
        aspectRatio="square"
        color="white"
        colorPalette="blue"
        rounded="md"
        size={ICON_BUTTON_SIZE}
        textStyle={ICON_BUTTON_TEXT_STYLE_DIGIT}
        onClick={() =>
          handleDigitInput(buttonValue, puzzleHistory, setPuzzleHistory)
        }
      >
        {buttonValue}
      </IconButton>
    </Square>
  </GridItem>
);
// #endregion

// #region Center Number Button

// #region Center Markup Input
const getUpdatedCenterMarkupsCellStateAfterRemoveCheck = (
  buttonValue: SudokuDigit,
  cellState: CellState,
  currentCenterMarkups: Array<SudokuDigit>,
): CellState => {
  if (!("centerMarkups" in cellState.cellContent)) return cellState;

  const updatedCenterMarkupsCellContentAfterRemoveCheck: MarkupDigits = {
    centerMarkups: currentCenterMarkups.filter(
      (centerMarkup) => centerMarkup !== buttonValue,
    ),
    cornerMarkups: cellState.cellContent.cornerMarkups,
  };

  const blankCenterMarkupsCellContent: MarkupDigits = {
    centerMarkups: [""],
    cornerMarkups: cellState.cellContent.cornerMarkups,
  };

  const updatedCenterMarkupsCellStateAfterRemoveCheck: CellState = {
    ...cellState,
    cellContent:
      updatedCenterMarkupsCellContentAfterRemoveCheck.centerMarkups.length > 0
        ? updatedCenterMarkupsCellContentAfterRemoveCheck
        : blankCenterMarkupsCellContent,
  };

  return updatedCenterMarkupsCellStateAfterRemoveCheck;
};

const getUpdatedCenterMarkupsCellStateAfterAddCheck = (
  buttonValue: SudokuDigit,
  cellState: CellState,
  currentCenterMarkups: Array<SudokuDigit>,
) => {
  if (!("centerMarkups" in cellState.cellContent)) return cellState;

  const updatedCenterMarkupsCellContentAfterAddCheck: MarkupDigits = {
    centerMarkups: currentCenterMarkups.includes(buttonValue)
      ? currentCenterMarkups
      : [...currentCenterMarkups, buttonValue],
    cornerMarkups: cellState.cellContent.cornerMarkups,
  };

  const updatedCenterMarkupsCellStateAfterAddCheck: CellState = {
    ...cellState,
    cellContent: updatedCenterMarkupsCellContentAfterAddCheck,
  };

  return updatedCenterMarkupsCellStateAfterAddCheck;
};

const getNewCenterMarkupDigitsCellState = (
  buttonValue: SudokuDigit,
  cellState: CellState,
) => {
  const newMarkupDigitsCellContent: MarkupDigits = {
    centerMarkups: [buttonValue],
    cornerMarkups: [""],
  };

  const newCenterMarkupDigitsCellState: CellState = {
    ...cellState,
    cellContent: newMarkupDigitsCellContent,
  };

  return newCenterMarkupDigitsCellState;
};

const handleCenterMarkupInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const selectedCellStatesWithExistingMarkupDigitsCellContent =
    currentBoardState.filter(
      (cellState): cellState is CellState & { cellContent: MarkupDigits } =>
        cellState.isSelected && "centerMarkups" in cellState.cellContent,
    );

  const doAllSelectedCellsHaveTheCenterMarkupInput =
    selectedCellStatesWithExistingMarkupDigitsCellContent.length > 0 &&
    selectedCellStatesWithExistingMarkupDigitsCellContent.every((cellState) =>
      cellState.cellContent.centerMarkups
        .filter((centerMarkup) => centerMarkup !== "")
        .includes(buttonValue),
    );

  const newBoardState: BoardState = currentBoardState.map((cellState) => {
    const isNotAStartingDigit = !("startingDigit" in cellState.cellContent);
    const isABlankPlayerDigit =
      "playerDigit" in cellState.cellContent &&
      cellState.cellContent.playerDigit === "";
    const isValidInputCell =
      cellState.isSelected &&
      isNotAStartingDigit &&
      (isABlankPlayerDigit || "centerMarkups" in cellState.cellContent);

    if (!isValidInputCell) return cellState;

    if ("centerMarkups" in cellState.cellContent) {
      const currentCenterMarkups = cellState.cellContent.centerMarkups.filter(
        (centerMarkup) => centerMarkup !== "",
      );

      if (doAllSelectedCellsHaveTheCenterMarkupInput)
        return getUpdatedCenterMarkupsCellStateAfterRemoveCheck(
          buttonValue,
          cellState,
          currentCenterMarkups,
        );
      else
        return getUpdatedCenterMarkupsCellStateAfterAddCheck(
          buttonValue,
          cellState,
          currentCenterMarkups,
        );
    } else if ("playerDigit" in cellState.cellContent) {
      return getNewCenterMarkupDigitsCellState(buttonValue, cellState);
    }

    return cellState;
  });

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

type CenterNumberButtonProps = {
  buttonValue: SudokuDigit;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const CenterNumberButton = ({
  buttonValue,
  puzzleHistory,
  setPuzzleHistory,
}: CenterNumberButtonProps) => (
  <GridItem colSpan={2}>
    <Square aspectRatio="square">
      <IconButton
        aspectRatio="square"
        color="white"
        colorPalette="blue"
        rounded="md"
        size={ICON_BUTTON_SIZE}
        textStyle={ICON_BUTTON_TEXT_STYLE_NONDIGIT}
        onClick={() =>
          handleCenterMarkupInput(buttonValue, puzzleHistory, setPuzzleHistory)
        }
      >
        {buttonValue}
      </IconButton>
    </Square>
  </GridItem>
);
// #endregion

// #region Corner Number Button

// #region Corner Markup Input
const getUpdatedCornerMarkupsCellStateAfterRemoveCheck = (
  buttonValue: SudokuDigit,
  cellState: CellState,
  currentCornerMarkups: Array<SudokuDigit>,
): CellState => {
  if (!("cornerMarkups" in cellState.cellContent)) return cellState;

  const updatedCornerMarkupsCellContentAfterRemoveCheck: MarkupDigits = {
    centerMarkups: cellState.cellContent.centerMarkups,
    cornerMarkups: currentCornerMarkups.filter(
      (cornerMarkup) => cornerMarkup !== buttonValue,
    ),
  };

  const blankCornerMarkupsCellContent: MarkupDigits = {
    centerMarkups: cellState.cellContent.centerMarkups,
    cornerMarkups: [""],
  };

  const updatedCornerMarkupsCellStateAfterRemoveCheck: CellState = {
    ...cellState,
    cellContent:
      updatedCornerMarkupsCellContentAfterRemoveCheck.cornerMarkups.length > 0
        ? updatedCornerMarkupsCellContentAfterRemoveCheck
        : blankCornerMarkupsCellContent,
  };

  return updatedCornerMarkupsCellStateAfterRemoveCheck;
};

const getUpdatedCornerMarkupsCellStateAfterAddCheck = (
  buttonValue: SudokuDigit,
  cellState: CellState,
  currentCornerMarkups: Array<SudokuDigit>,
) => {
  if (!("cornerMarkups" in cellState.cellContent)) return cellState;

  const updatedCornerMarkupsCellContentAfterAddCheck: MarkupDigits = {
    centerMarkups: cellState.cellContent.centerMarkups,
    cornerMarkups: currentCornerMarkups.includes(buttonValue)
      ? currentCornerMarkups
      : [...currentCornerMarkups, buttonValue],
  };

  const updatedCornerMarkupsCellStateAfterAddCheck: CellState = {
    ...cellState,
    cellContent: updatedCornerMarkupsCellContentAfterAddCheck,
  };

  return updatedCornerMarkupsCellStateAfterAddCheck;
};

const getNewCornerMarkupDigitsCellState = (
  buttonValue: SudokuDigit,
  cellState: CellState,
) => {
  const newMarkupDigitsCellContent: MarkupDigits = {
    centerMarkups: [""],
    cornerMarkups: [buttonValue],
  };

  const newCornerMarkupDigitsCellState: CellState = {
    ...cellState,
    cellContent: newMarkupDigitsCellContent,
  };

  return newCornerMarkupDigitsCellState;
};

const handleCornerMarkupInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const selectedCellStatesWithExistingMarkupDigitsCellContent =
    currentBoardState.filter(
      (cellState): cellState is CellState & { cellContent: MarkupDigits } =>
        cellState.isSelected && "cornerMarkups" in cellState.cellContent,
    );

  const doAllSelectedCellsHaveTheCornerMarkupInput =
    selectedCellStatesWithExistingMarkupDigitsCellContent.length > 0 &&
    selectedCellStatesWithExistingMarkupDigitsCellContent.every((cellState) =>
      cellState.cellContent.cornerMarkups
        .filter((cornerMarkup) => cornerMarkup !== "")
        .includes(buttonValue),
    );

  const newBoardState: BoardState = currentBoardState.map((cellState) => {
    const isNotAStartingDigit = !("startingDigit" in cellState.cellContent);
    const isABlankPlayerDigit =
      "playerDigit" in cellState.cellContent &&
      cellState.cellContent.playerDigit === "";
    const isValidInputCell =
      cellState.isSelected &&
      isNotAStartingDigit &&
      (isABlankPlayerDigit || "cornerMarkups" in cellState.cellContent);

    if (!isValidInputCell) return cellState;

    if ("cornerMarkups" in cellState.cellContent) {
      const currentCornerMarkups = cellState.cellContent.cornerMarkups.filter(
        (cornerMarkup) => cornerMarkup !== "",
      );

      if (doAllSelectedCellsHaveTheCornerMarkupInput)
        return getUpdatedCornerMarkupsCellStateAfterRemoveCheck(
          buttonValue,
          cellState,
          currentCornerMarkups,
        );
      else
        return getUpdatedCornerMarkupsCellStateAfterAddCheck(
          buttonValue,
          cellState,
          currentCornerMarkups,
        );
    } else if ("playerDigit" in cellState.cellContent) {
      return getNewCornerMarkupDigitsCellState(buttonValue, cellState);
    }

    return cellState;
  });

  handleSetPuzzleHistory(newBoardState, setPuzzleHistory);
};
// #endregion

type CornerNumberButtonProps = {
  buttonValue: SudokuDigit;
  buttonValueAsNumber: number;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const CornerNumberButton = ({
  buttonValue,
  buttonValueAsNumber,
  puzzleHistory,
  setPuzzleHistory,
}: CornerNumberButtonProps) => {
  const getAlignItems = () => {
    if (buttonValueAsNumber <= 3) return "start";
    else if (buttonValueAsNumber <= 6) return "center";
    else return "end";
  };

  const getJustifyContent = () => {
    if (buttonValueAsNumber % 3 === 1) return "start";
    else if (buttonValueAsNumber % 3 === 2) return "center";
    else return "end";
  };

  return (
    <GridItem colSpan={2}>
      <Square aspectRatio="square">
        <IconButton
          alignItems={getAlignItems()}
          aspectRatio="square"
          color="white"
          colorPalette="blue"
          justifyContent={getJustifyContent()}
          padding={{ base: "1", md: "1.5" }}
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={ICON_BUTTON_TEXT_STYLE_NONDIGIT}
          onClick={() =>
            handleCornerMarkupInput(
              buttonValue,
              puzzleHistory,
              setPuzzleHistory,
            )
          }
        >
          {buttonValue}
        </IconButton>
      </Square>
    </GridItem>
  );
};
// #endregion

type NumberPadProps = {
  inputMode: InputMode;
  puzzleHistory: PuzzleHistory;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

const NumberPad = ({
  inputMode,
  puzzleHistory,
  setPuzzleHistory,
}: NumberPadProps) => (
  <>
    {sudokuDigits.map((digit, index) => {
      if (inputMode === "Digit")
        return (
          <DigitNumberButton
            buttonValue={digit}
            key={digit}
            puzzleHistory={puzzleHistory}
            setPuzzleHistory={setPuzzleHistory}
          />
        );
      else if (inputMode === "Center")
        return (
          <CenterNumberButton
            buttonValue={digit}
            key={digit}
            puzzleHistory={puzzleHistory}
            setPuzzleHistory={setPuzzleHistory}
          />
        );
      else
        return (
          <CornerNumberButton
            buttonValue={digit}
            buttonValueAsNumber={index + 1}
            key={digit}
            puzzleHistory={puzzleHistory}
            setPuzzleHistory={setPuzzleHistory}
          />
        );
    })}
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
const handleClearButton = (
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const currentBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const newBoardState: BoardState = currentBoardState.map((cellState) => {
    const isNotAClearableCell = !cellState.isSelected;
    if (isNotAClearableCell) return cellState;

    const isNotAStartingDigit = !("startingDigit" in cellState.cellContent);

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

    const newCellState = isNotAStartingDigit
      ? newPlayerDigitCellState
      : newStartingDigitCellState;

    return newCellState;
  });

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
    gap={{ base: "0.2916rem", sm: "1", md: "1.5" }}
    height="fit-content"
  >
    {inputMode === "Color" ? (
      <ColorPad
        puzzleHistory={puzzleHistory}
        setPuzzleHistory={setPuzzleHistory}
      />
    ) : (
      <NumberPad
        inputMode={inputMode}
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
