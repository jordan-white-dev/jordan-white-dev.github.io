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
  isCenterMarkupsInCellContent,
  isCornerMarkupsInCellContent,
  isPlayerDigitInCellContent,
  isStartingDigitInCellContent,
} from "@/lib/shared/constants";
import {
  type BoardState,
  type CellState,
  type InputMode,
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
  type MarkupDigits,
  type MarkupDigitsCellContent,
  markupColors,
  type PlayerDigitCellContent,
  type PuzzleHistory,
  type SudokuDigit,
  sudokuDigits,
} from "@/lib/shared/types";

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

const getUpdatedMarkupDigitsCellStateAfterRemoveCheck = (
  markupType: "centerMarkups" | "cornerMarkups",
  buttonValue: SudokuDigit,
  previousCellState: CellState,
  previousMarkups: Array<SudokuDigit>,
): CellState => {
  const previousCellContent = previousCellState.cellContent;

  if (!isCenterMarkupsInCellContent(previousCellContent))
    return previousCellState;

  const previousMarkupsNotMatchingTheButtonValue = previousMarkups.filter(
    (previousMarkup) => previousMarkup !== buttonValue,
  );

  const updatedMarkups: [""] | Array<SudokuDigit> =
    previousMarkupsNotMatchingTheButtonValue.length > 0
      ? previousMarkupsNotMatchingTheButtonValue
      : [""];

  const centerMarkups: MarkupDigits =
    markupType === "centerMarkups"
      ? updatedMarkups
      : previousCellContent.centerMarkups;

  const cornerMarkups: MarkupDigits =
    markupType === "cornerMarkups"
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
// #endregion

// #region Color Pad

// #region Color Button

// #region Color Pad Input
const getUpdatedMarkupColorsCellStateAfterRemoveCheck = (
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
  } else {
    const markupColorsCellStateAfterRemoveCheck: CellState = {
      ...previousCellState,
      markupColors: [""],
    };

    return markupColorsCellStateAfterRemoveCheck;
  }
};

const getUpdatedMarkupColorsCellStateAfterAddCheck = (
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

const handleColorPadInput = (
  markupColor: MarkupColor,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const doAllSelectedCellsHaveTheMarkupColorInput = previousBoardState
    .filter((previousCellState) => previousCellState.isSelected)
    .every((previousCellState) =>
      previousCellState.markupColors
        .filter((previousMarkupColor) => previousMarkupColor !== "")
        .includes(markupColor),
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) => {
      if (!previousCellState.isSelected) return previousCellState;

      const previousMarkupColors = previousCellState.markupColors.filter(
        (previousMarkupColor) => previousMarkupColor !== "",
      );

      return doAllSelectedCellsHaveTheMarkupColorInput
        ? getUpdatedMarkupColorsCellStateAfterRemoveCheck(
            markupColor,
            previousCellState,
            previousMarkupColors,
          )
        : getUpdatedMarkupColorsCellStateAfterAddCheck(
            markupColor,
            previousCellState,
            previousMarkupColors,
          );
    },
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
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const selectedCells = previousBoardState.filter(
    (previousCellState) => previousCellState.isSelected,
  );

  const selectedCellsWithPlayerDigitCellContent = previousBoardState
    .filter(
      (
        previousCellState,
      ): previousCellState is CellState & {
        cellContent: PlayerDigitCellContent;
      } =>
        previousCellState.isSelected &&
        isPlayerDigitInCellContent(previousCellState.cellContent),
    )
    .map((previousCellState) => previousCellState.cellContent.playerDigit);

  const doAllSelectedCellsHavePlayerDigitCellContent =
    selectedCellsWithPlayerDigitCellContent.length === selectedCells.length;

  const doAllSelectedCellsHaveTheButtonValueAsAPlayerDigit =
    selectedCellsWithPlayerDigitCellContent.length > 0 &&
    selectedCellsWithPlayerDigitCellContent.every(
      (playerDigit) => playerDigit === buttonValue,
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) => {
      const previousCellContent = previousCellState.cellContent;

      const isValidInputCell =
        previousCellState.isSelected &&
        !isStartingDigitInCellContent(previousCellContent);
      if (!isValidInputCell) return previousCellState;

      if (
        isPlayerDigitInCellContent(previousCellContent) &&
        doAllSelectedCellsHavePlayerDigitCellContent &&
        doAllSelectedCellsHaveTheButtonValueAsAPlayerDigit
      ) {
        const newEmptyValueAsPlayerDigitCellState: CellState = {
          ...previousCellState,
          cellContent: {
            playerDigit: "",
          },
        };

        return newEmptyValueAsPlayerDigitCellState;
      } else {
        const newButtonValueAsPlayerDigitCellState: CellState = {
          ...previousCellState,
          cellContent: {
            playerDigit: buttonValue,
          },
        };

        return newButtonValueAsPlayerDigitCellState;
      }
    },
  );

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
const getUpdatedCenterMarkupsCellStateAfterAddCheck = (
  buttonValue: SudokuDigit,
  previousCellState: CellState,
  previousCenterMarkups: Array<SudokuDigit>,
) => {
  const previousCellContent = previousCellState.cellContent;

  if (!isCenterMarkupsInCellContent(previousCellContent))
    return previousCellState;

  const updatedCenterMarkupsCellContentAfterAddCheck: MarkupDigitsCellContent =
    {
      centerMarkups: previousCenterMarkups.includes(buttonValue)
        ? previousCenterMarkups
        : [...previousCenterMarkups, buttonValue],
      cornerMarkups: previousCellContent.cornerMarkups,
    };

  const updatedCenterMarkupsCellStateAfterAddCheck: CellState = {
    ...previousCellState,
    cellContent: updatedCenterMarkupsCellContentAfterAddCheck,
  };

  return updatedCenterMarkupsCellStateAfterAddCheck;
};

const getNewCenterMarkupDigitsCellState = (
  buttonValue: SudokuDigit,
  previousCellState: CellState,
) => {
  const newMarkupDigitsCellContent: MarkupDigitsCellContent = {
    centerMarkups: [buttonValue],
    cornerMarkups: [""],
  };

  const newCenterMarkupDigitsCellState: CellState = {
    ...previousCellState,
    cellContent: newMarkupDigitsCellContent,
  };

  return newCenterMarkupDigitsCellState;
};

const handleCenterMarkupInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const selectedCellsWithMarkupDigitsCellContent = previousBoardState.filter(
    (
      previousCellState,
    ): previousCellState is CellState & {
      cellContent: MarkupDigitsCellContent;
    } =>
      previousCellState.isSelected &&
      isCenterMarkupsInCellContent(previousCellState.cellContent),
  );

  const doAllSelectedCellsHaveTheButtonValueAsACenterMarkup =
    selectedCellsWithMarkupDigitsCellContent.length > 0 &&
    selectedCellsWithMarkupDigitsCellContent.every((previousCellState) =>
      previousCellState.cellContent.centerMarkups
        .filter((centerMarkup) => centerMarkup !== "")
        .includes(buttonValue),
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) => {
      const previousCellContent = previousCellState.cellContent;

      const isNotAStartingDigit =
        !isStartingDigitInCellContent(previousCellContent);

      const isABlankPlayerDigit =
        isPlayerDigitInCellContent(previousCellContent) &&
        previousCellContent.playerDigit === "";

      const isValidInputCell =
        previousCellState.isSelected &&
        isNotAStartingDigit &&
        (isABlankPlayerDigit ||
          isCenterMarkupsInCellContent(previousCellContent));

      if (!isValidInputCell) return previousCellState;

      if (isCenterMarkupsInCellContent(previousCellContent)) {
        const previousCenterMarkups = previousCellContent.centerMarkups.filter(
          (previousCenterMarkup) => previousCenterMarkup !== "",
        );

        if (doAllSelectedCellsHaveTheButtonValueAsACenterMarkup)
          return getUpdatedMarkupDigitsCellStateAfterRemoveCheck(
            "centerMarkups",
            buttonValue,
            previousCellState,
            previousCenterMarkups,
          );
        else
          return getUpdatedCenterMarkupsCellStateAfterAddCheck(
            buttonValue,
            previousCellState,
            previousCenterMarkups,
          );
      } else if (isPlayerDigitInCellContent(previousCellContent)) {
        return getNewCenterMarkupDigitsCellState(
          buttonValue,
          previousCellState,
        );
      }

      return previousCellState;
    },
  );

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
const getUpdatedCornerMarkupsCellStateAfterAddCheck = (
  buttonValue: SudokuDigit,
  previousCellState: CellState,
  previousCornerMarkups: Array<SudokuDigit>,
) => {
  const previousCellContent = previousCellState.cellContent;

  if (!isCornerMarkupsInCellContent(previousCellContent))
    return previousCellState;

  const updatedCornerMarkupsCellContentAfterAddCheck: MarkupDigitsCellContent =
    {
      centerMarkups: previousCellContent.centerMarkups,
      cornerMarkups: previousCornerMarkups.includes(buttonValue)
        ? previousCornerMarkups
        : [...previousCornerMarkups, buttonValue],
    };

  const updatedCornerMarkupsCellStateAfterAddCheck: CellState = {
    ...previousCellState,
    cellContent: updatedCornerMarkupsCellContentAfterAddCheck,
  };

  return updatedCornerMarkupsCellStateAfterAddCheck;
};

const getNewCornerMarkupDigitsCellState = (
  buttonValue: SudokuDigit,
  previousCellState: CellState,
) => {
  const newMarkupDigitsCellContent: MarkupDigitsCellContent = {
    centerMarkups: [""],
    cornerMarkups: [buttonValue],
  };

  const newCornerMarkupDigitsCellState: CellState = {
    ...previousCellState,
    cellContent: newMarkupDigitsCellContent,
  };

  return newCornerMarkupDigitsCellState;
};

const handleCornerMarkupInput = (
  buttonValue: SudokuDigit,
  puzzleHistory: PuzzleHistory,
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) => {
  const previousBoardState =
    puzzleHistory.boardStateHistory[puzzleHistory.currentBoardStateIndex];

  const selectedCellsWithMarkupDigitsCellContent = previousBoardState.filter(
    (
      previousCellState,
    ): previousCellState is CellState & {
      cellContent: MarkupDigitsCellContent;
    } =>
      previousCellState.isSelected &&
      isCornerMarkupsInCellContent(previousCellState.cellContent),
  );

  const doAllSelectedCellsHaveTheButtonValueAsACornerMarkup =
    selectedCellsWithMarkupDigitsCellContent.length > 0 &&
    selectedCellsWithMarkupDigitsCellContent.every((previousCellState) =>
      previousCellState.cellContent.cornerMarkups
        .filter((cornerMarkup) => cornerMarkup !== "")
        .includes(buttonValue),
    );

  const newBoardState: BoardState = previousBoardState.map(
    (previousCellState) => {
      const previousCellContent = previousCellState.cellContent;

      const isNotAStartingDigit =
        !isStartingDigitInCellContent(previousCellContent);

      const isABlankPlayerDigit =
        isPlayerDigitInCellContent(previousCellContent) &&
        previousCellContent.playerDigit === "";

      const isValidInputCell =
        previousCellState.isSelected &&
        isNotAStartingDigit &&
        (isABlankPlayerDigit ||
          isCornerMarkupsInCellContent(previousCellContent));

      if (!isValidInputCell) return previousCellState;

      if (isCornerMarkupsInCellContent(previousCellContent)) {
        const previousCornerMarkups = previousCellContent.cornerMarkups.filter(
          (previousCornerMarkup) => previousCornerMarkup !== "",
        );

        if (doAllSelectedCellsHaveTheButtonValueAsACornerMarkup)
          return getUpdatedMarkupDigitsCellStateAfterRemoveCheck(
            "cornerMarkups",
            buttonValue,
            previousCellState,
            previousCornerMarkups,
          );
        else
          return getUpdatedCornerMarkupsCellStateAfterAddCheck(
            buttonValue,
            previousCellState,
            previousCornerMarkups,
          );
      } else if (isPlayerDigitInCellContent(previousCellContent)) {
        return getNewCornerMarkupDigitsCellState(
          buttonValue,
          previousCellState,
        );
      }

      return previousCellState;
    },
  );

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
      } else {
        const newPlayerDigitCellState: CellState = {
          ...previousCellState,
          cellContent: {
            playerDigit: "",
          },
          markupColors: [""],
        };

        return newPlayerDigitCellState;
      }
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
