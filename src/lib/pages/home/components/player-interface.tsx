import { Stack } from "@chakra-ui/react";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useSessionStorageState from "use-session-storage-state";

import {
  exhaustiveGuard,
  handleCenterMarkupInput,
  handleClearButton,
  handleColorPadInput,
  handleCornerMarkupInput,
  handleDigitInput,
} from "@/lib/pages/home/model/constants";
import {
  getSudokuDigitFromString,
  isSudokuDigit,
  type KeypadMode,
  type PuzzleHistory,
  type RawBoardState,
  type SudokuDigit,
} from "@/lib/pages/home/types";

import { Keypad } from "./keypad";
import { KeypadModeRadioCard } from "./keypad-modes";
import { PuzzleActions } from "./puzzle-actions";

type ModifierKeyboardKey = "Control" | "Shift" | "Alt";
const modifierKeyboardKeys = ["Control", "Shift", "Alt"] as const;

const isModifierKeyboardKey = (
  keyboardKey: string,
): keyboardKey is ModifierKeyboardKey =>
  modifierKeyboardKeys.includes(keyboardKey as ModifierKeyboardKey);

const keypadModesByModifierKeyboardKey: Record<
  ModifierKeyboardKey,
  Exclude<KeypadMode, "Digit">
> = {
  Control: "Center",
  Shift: "Corner",
  Alt: "Color",
};

const keypadModeByShortcutKey = {
  z: "Digit",
  x: "Center",
  c: "Corner",
  v: "Color",
} as const satisfies Record<string, KeypadMode>;
type KeypadModeShortcutKey = keyof typeof keypadModeByShortcutKey;

const isKeypadModeShortcutKey = (
  keyboardKey: string,
): keyboardKey is KeypadModeShortcutKey =>
  keyboardKey in keypadModeByShortcutKey;

const shiftedNumpadKeyToDigit: Partial<Record<string, SudokuDigit>> = {
  End: getSudokuDigitFromString("1"),
  ArrowDown: getSudokuDigitFromString("2"),
  PageDown: getSudokuDigitFromString("3"),
  ArrowLeft: getSudokuDigitFromString("4"),
  Clear: getSudokuDigitFromString("5"),
  ArrowRight: getSudokuDigitFromString("6"),
  Home: getSudokuDigitFromString("7"),
  ArrowUp: getSudokuDigitFromString("8"),
  PageUp: getSudokuDigitFromString("9"),
};

const getModifierKeyDownOrderWithAddedModifier = (
  modifierKeyboardKeyToAdd: ModifierKeyboardKey,
  previousModifierKeyDownOrder: Array<ModifierKeyboardKey>,
): Array<ModifierKeyboardKey> =>
  previousModifierKeyDownOrder.includes(modifierKeyboardKeyToAdd)
    ? previousModifierKeyDownOrder
    : [...previousModifierKeyDownOrder, modifierKeyboardKeyToAdd];

const doModifierKeyDownOrdersMatch = (
  firstModifierKeyDownOrder: Array<ModifierKeyboardKey>,
  secondModifierKeyDownOrder: Array<ModifierKeyboardKey>,
): boolean =>
  firstModifierKeyDownOrder.length === secondModifierKeyDownOrder.length &&
  firstModifierKeyDownOrder.every(
    (modifierKeyboardKey, modifierKeyboardKeyIndex) =>
      modifierKeyboardKey ===
      secondModifierKeyDownOrder[modifierKeyboardKeyIndex],
  );

const isEditableHtmlElement = (eventTarget: EventTarget | null): boolean =>
  eventTarget instanceof HTMLElement &&
  (eventTarget.isContentEditable ||
    eventTarget.tagName === "INPUT" ||
    eventTarget.tagName === "TEXTAREA" ||
    eventTarget.tagName === "SELECT");

const isNumpadKeyboardEvent = (keyboardEvent: KeyboardEvent): boolean =>
  keyboardEvent.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;

const getSudokuDigitFromKeyboardEvent = (
  keyboardEvent: KeyboardEvent,
): SudokuDigit | undefined => {
  if (isNumpadKeyboardEvent(keyboardEvent)) {
    const shiftedNumpadDigit = shiftedNumpadKeyToDigit[keyboardEvent.key];
    if (shiftedNumpadDigit !== undefined) return shiftedNumpadDigit;

    const candidateFromKey = keyboardEvent.key;
    if (isSudokuDigit(candidateFromKey)) return candidateFromKey;

    const candidateFromCode = keyboardEvent.code.replace("Numpad", "");
    if (isSudokuDigit(candidateFromCode)) return candidateFromCode;

    return undefined;
  }

  const keyboardCode = keyboardEvent.code;

  if (!keyboardCode.startsWith("Digit")) return undefined;

  const candidateSudokuDigit = keyboardCode.replace("Digit", "");

  return isSudokuDigit(candidateSudokuDigit) ? candidateSudokuDigit : undefined;
};

const isShiftIntendedForNumpadKeyboardEvent = (
  keyboardEvent: KeyboardEvent,
  lastShiftKeyDownTimestamp: number | null,
  lastShiftKeyUpTimestamp: number | null,
): boolean => {
  if (!isNumpadKeyboardEvent(keyboardEvent)) return false;

  if (keyboardEvent.shiftKey) return true;

  if (lastShiftKeyDownTimestamp === null || lastShiftKeyUpTimestamp === null)
    return false;

  const millisecondsBetweenShiftKeyUpAndCurrentEvent =
    keyboardEvent.timeStamp - lastShiftKeyUpTimestamp;

  const didShiftGoDownBeforeItWentUp =
    lastShiftKeyDownTimestamp <= lastShiftKeyUpTimestamp;

  return (
    didShiftGoDownBeforeItWentUp &&
    millisecondsBetweenShiftKeyUpAndCurrentEvent >= 0 &&
    millisecondsBetweenShiftKeyUpAndCurrentEvent <= 50
  );
};

const getEffectiveKeypadMode = (
  baseKeypadMode: KeypadMode,
  modifierKeyDownOrder: Array<ModifierKeyboardKey>,
): KeypadMode => {
  const mostRecentlyPressedModifierKeyboardKey =
    modifierKeyDownOrder[modifierKeyDownOrder.length - 1];

  const effectiveKeypadMode =
    mostRecentlyPressedModifierKeyboardKey === undefined
      ? baseKeypadMode
      : keypadModesByModifierKeyboardKey[
          mostRecentlyPressedModifierKeyboardKey
        ];

  return effectiveKeypadMode;
};

const getEffectiveKeypadModeForKeyboardEvent = (
  baseKeypadMode: KeypadMode,
  keyboardEvent: KeyboardEvent,
  lastShiftKeyDownTimestamp: number | null,
  lastShiftKeyUpTimestamp: number | null,
  modifierKeyDownOrder: Array<ModifierKeyboardKey>,
): KeypadMode => {
  if (
    isShiftIntendedForNumpadKeyboardEvent(
      keyboardEvent,
      lastShiftKeyDownTimestamp,
      lastShiftKeyUpTimestamp,
    )
  )
    return "Corner";

  return getEffectiveKeypadMode(baseKeypadMode, modifierKeyDownOrder);
};

const getPuzzleHistoryWithUpdatedBoardStateIndex = (
  previousPuzzleHistory: PuzzleHistory,
  boardStateIndexChange: number,
): PuzzleHistory => ({
  ...previousPuzzleHistory,
  currentBoardStateIndex:
    previousPuzzleHistory.currentBoardStateIndex + boardStateIndexChange,
});

const handleRedoShortcut = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) =>
    previousPuzzleHistory.currentBoardStateIndex <
    previousPuzzleHistory.boardStateHistory.length - 1
      ? getPuzzleHistoryWithUpdatedBoardStateIndex(previousPuzzleHistory, 1)
      : previousPuzzleHistory,
  );

const handleUndoShortcut = (
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>,
) =>
  setPuzzleHistory((previousPuzzleHistory) =>
    previousPuzzleHistory.boardStateHistory.length > 1 &&
    previousPuzzleHistory.currentBoardStateIndex > 0
      ? getPuzzleHistoryWithUpdatedBoardStateIndex(previousPuzzleHistory, -1)
      : previousPuzzleHistory,
  );

const getModifierKeyDownOrderWithRemovedModifier = (
  previousModifierKeyDownOrder: Array<ModifierKeyboardKey>,
  modifierKeyboardKeyToRemove: ModifierKeyboardKey,
): Array<ModifierKeyboardKey> =>
  previousModifierKeyDownOrder.filter(
    (modifierKeyboardKey) =>
      modifierKeyboardKey !== modifierKeyboardKeyToRemove,
  );

type PlayerInterfaceProps = {
  isMultiselectMode: boolean;
  puzzleHistory: PuzzleHistory;
  rawBoardState: RawBoardState;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
  setPuzzleHistory: Dispatch<SetStateAction<PuzzleHistory>>;
};

export const PlayerInterface = ({
  isMultiselectMode,
  puzzleHistory,
  rawBoardState,
  setIsMultiselectMode,
  setPuzzleHistory,
}: PlayerInterfaceProps) => {
  const [baseKeypadMode, setBaseKeypadMode] =
    useSessionStorageState<KeypadMode>("keypad-mode", {
      defaultValue: "Digit",
    });
  const [modifierKeyDownOrderForRender, setModifierKeyDownOrderForRender] =
    useState<Array<ModifierKeyboardKey>>([]);

  const puzzleHistoryRef = useRef(puzzleHistory);
  const baseKeypadModeRef = useRef(baseKeypadMode);
  const modifierKeyDownOrderRef = useRef<Array<ModifierKeyboardKey>>([]);
  const lastShiftKeyDownTimestampRef = useRef<number | null>(null);
  const lastShiftKeyUpTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    puzzleHistoryRef.current = puzzleHistory;
  }, [puzzleHistory]);

  useEffect(() => {
    baseKeypadModeRef.current = baseKeypadMode;
  }, [baseKeypadMode]);

  const setModifierKeyDownOrder = useCallback(
    (nextModifierKeyDownOrder: Array<ModifierKeyboardKey>) => {
      modifierKeyDownOrderRef.current = nextModifierKeyDownOrder;
      setModifierKeyDownOrderForRender(nextModifierKeyDownOrder);
    },
    [],
  );

  const resetModifierKeyDownOrder = useCallback(() => {
    if (modifierKeyDownOrderRef.current.length === 0) return;
    setModifierKeyDownOrder([]);
  }, [setModifierKeyDownOrder]);

  useEffect(() => {
    const captureKeyboardEvents = true;

    const handleModifierKeyDown = (
      event: KeyboardEvent,
      modifierKeyboardKey: ModifierKeyboardKey,
    ) => {
      event.preventDefault();

      if (event.repeat) return;

      if (event.key === "Shift")
        lastShiftKeyDownTimestampRef.current = event.timeStamp;

      const nextModifierKeyDownOrder = getModifierKeyDownOrderWithAddedModifier(
        modifierKeyboardKey,
        modifierKeyDownOrderRef.current,
      );

      if (
        !doModifierKeyDownOrdersMatch(
          modifierKeyDownOrderRef.current,
          nextModifierKeyDownOrder,
        )
      )
        setModifierKeyDownOrder(nextModifierKeyDownOrder);

      return;
    };

    const handleNumberKeyDown = (
      sudokuDigit: SudokuDigit,
      keyboardEvent: KeyboardEvent,
    ) => {
      const effectiveKeypadMode = getEffectiveKeypadModeForKeyboardEvent(
        baseKeypadModeRef.current,
        keyboardEvent,
        lastShiftKeyDownTimestampRef.current,
        lastShiftKeyUpTimestampRef.current,
        modifierKeyDownOrderRef.current,
      );

      switch (effectiveKeypadMode) {
        case "Digit":
          handleDigitInput(
            sudokuDigit,
            puzzleHistoryRef.current,
            setPuzzleHistory,
          );
          return;
        case "Center":
          handleCenterMarkupInput(
            sudokuDigit,
            puzzleHistoryRef.current,
            setPuzzleHistory,
          );
          return;
        case "Corner":
          handleCornerMarkupInput(
            sudokuDigit,
            puzzleHistoryRef.current,
            setPuzzleHistory,
          );
          return;
        case "Color":
          handleColorPadInput(
            sudokuDigit,
            puzzleHistoryRef.current,
            setPuzzleHistory,
          );
          return;
        default:
          exhaustiveGuard(effectiveKeypadMode);
      }
    };

    const handleSudokuDigitKeyDown = (event: KeyboardEvent) => {
      const sudokuDigit = getSudokuDigitFromKeyboardEvent(event);

      if (sudokuDigit === undefined) return false;

      event.preventDefault();
      handleNumberKeyDown(sudokuDigit, event);
      return true;
    };

    const isControlPressedForShortcut = () =>
      modifierKeyDownOrderRef.current.includes("Control");

    const handleUndoOrRedoKeyDown = (
      event: KeyboardEvent,
      lowerCaseKey: string,
    ) => {
      const isControlPressed = isControlPressedForShortcut() && !event.metaKey;

      if (isControlPressed && lowerCaseKey === "z") {
        event.preventDefault();

        if (modifierKeyDownOrderRef.current.includes("Shift"))
          handleRedoShortcut(setPuzzleHistory);
        else handleUndoShortcut(setPuzzleHistory);

        return true;
      }

      if (isControlPressed && lowerCaseKey === "y") {
        event.preventDefault();
        handleRedoShortcut(setPuzzleHistory);
        return true;
      }

      return false;
    };

    const hasBlockingModifierKey = (event: KeyboardEvent) =>
      modifierKeyDownOrderRef.current.includes("Control") ||
      modifierKeyDownOrderRef.current.includes("Alt") ||
      event.metaKey;

    const handleKeypadModeShortcutKeyDown = (
      event: KeyboardEvent,
      lowerCaseKey: string,
    ) => {
      if (hasBlockingModifierKey(event)) return false;
      if (!isKeypadModeShortcutKey(lowerCaseKey)) return false;

      event.preventDefault();
      setBaseKeypadMode(keypadModeByShortcutKey[lowerCaseKey]);
      return true;
    };

    const handleClearKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" &&
        event.key !== "Backspace" &&
        event.key !== "Delete"
      )
        return false;

      event.preventDefault();
      handleClearButton(puzzleHistoryRef.current, setPuzzleHistory);
      return true;
    };

    const handleMultiselectModeShortcutKeyDown = (
      event: KeyboardEvent,
      lowerCaseKey: string,
    ) => {
      if (hasBlockingModifierKey(event)) return false;
      if (lowerCaseKey !== "m") return false;

      event.preventDefault();
      setIsMultiselectMode(
        (previousIsMultiselectMode) => !previousIsMultiselectMode,
      );
      return true;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModifierKeyboardKey(event.key)) {
        handleModifierKeyDown(event, event.key);
        return;
      }

      if (isEditableHtmlElement(event.target)) return;

      const lowerCaseKey = event.key.toLowerCase();

      const keyDownHandlers = [
        () => handleSudokuDigitKeyDown(event),
        () => handleUndoOrRedoKeyDown(event, lowerCaseKey),
        () => handleKeypadModeShortcutKeyDown(event, lowerCaseKey),
        () => handleClearKeyDown(event),
        () => handleMultiselectModeShortcutKeyDown(event, lowerCaseKey),
      ];

      keyDownHandlers.some((handler) => handler());
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isModifierKeyboardKey(event.key)) return;

      event.preventDefault();

      if (event.key === "Shift")
        lastShiftKeyUpTimestampRef.current = event.timeStamp;

      const nextModifierKeyDownOrder =
        getModifierKeyDownOrderWithRemovedModifier(
          modifierKeyDownOrderRef.current,
          event.key,
        );

      if (
        !doModifierKeyDownOrdersMatch(
          modifierKeyDownOrderRef.current,
          nextModifierKeyDownOrder,
        )
      )
        setModifierKeyDownOrder(nextModifierKeyDownOrder);
    };

    const handleWindowBlur = () => {
      resetModifierKeyDownOrder();
    };

    window.addEventListener("keydown", handleKeyDown, captureKeyboardEvents);
    window.addEventListener("keyup", handleKeyUp, captureKeyboardEvents);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
        captureKeyboardEvents,
      );
      window.removeEventListener("keyup", handleKeyUp, captureKeyboardEvents);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [
    setBaseKeypadMode,
    setIsMultiselectMode,
    setPuzzleHistory,
    resetModifierKeyDownOrder,
    setModifierKeyDownOrder,
  ]);

  const effectiveKeypadMode = getEffectiveKeypadMode(
    baseKeypadMode,
    modifierKeyDownOrderForRender,
  );

  return (
    <Stack
      alignItems="center"
      direction={{ base: "row", lg: "column" }}
      gap="4"
      minWidth={{ lg: "52" }}
    >
      <PuzzleActions
        puzzleHistory={puzzleHistory}
        rawBoardState={rawBoardState}
        setPuzzleHistory={setPuzzleHistory}
      />
      <Keypad
        isMultiselectMode={isMultiselectMode}
        keypadMode={effectiveKeypadMode}
        puzzleHistory={puzzleHistory}
        setIsMultiselectMode={setIsMultiselectMode}
        setPuzzleHistory={setPuzzleHistory}
      />
      <KeypadModeRadioCard
        keypadMode={effectiveKeypadMode}
        setBaseKeypadMode={setBaseKeypadMode}
      />
    </Stack>
  );
};
