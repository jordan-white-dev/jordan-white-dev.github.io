import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { makepuzzle } from "sudoku";

import { PlayerInterface } from "./components/playerinterface";
import { SudokuGrid } from "./components/sudokugrid";
import type { MarkupColor } from "./components/svgs";

// #region Types
export const inputModes = ["Digit", "Color", "Center", "Corner"] as const;
export type InputMode = (typeof inputModes)[number];

export type RawSudokuBoard = Array<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | null>;

export const sudokuDigits = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;
export type SudokuDigit = (typeof sudokuDigits)[number];
export type StartingDigitCellContent = { startingDigit: SudokuDigit };
export type PlayerDigitCellContent = { playerDigit: SudokuDigit | "" };
type MarkupCellContent = {
  centerMarkups: Array<SudokuDigit> | "";
  cornerMarkups: Array<SudokuDigit> | "";
  markupColor: MarkupColor;
};
export type CellContent =
  | StartingDigitCellContent
  | PlayerDigitCellContent
  | MarkupCellContent;
export type Cell = {
  boxNumber: number;
  cellContent: CellContent;
  cellNumber: number;
  columnNumber: number;
  isSelected: boolean;
  rowNumber: number;
};
export type SudokuBoardState = Array<Cell>;
export type PuzzleHistory = Array<SudokuBoardState>;
// #endregion

export const buildSudokuBoardState = (
  rawSudokuBoard: RawSudokuBoard,
): SudokuBoardState => {
  const sudokuBoardState: SudokuBoardState = [];

  for (let cellNumber = 1; cellNumber <= 81; cellNumber++) {
    const rowNumber = Math.floor((cellNumber - 1) / 9) + 1;
    const columnNumber = ((cellNumber - 1) % 9) + 1;
    const boxNumber =
      Math.floor((rowNumber - 1) / 3) * 3 +
      Math.floor((columnNumber - 1) / 3) +
      1;

    const rawSudokuBoardCell = rawSudokuBoard[cellNumber - 1];

    const cellContent: CellContent =
      rawSudokuBoardCell === null
        ? { playerDigit: "" }
        : { startingDigit: (rawSudokuBoardCell + 1).toString() as SudokuDigit };

    sudokuBoardState.push({
      boxNumber,
      cellContent,
      cellNumber,
      columnNumber,
      isSelected: false,
      rowNumber,
    });
  }

  return sudokuBoardState;
};

export const getNewPuzzle = (): {
  initialRawSudokuBoard: RawSudokuBoard;
  sudokuBoardState: SudokuBoardState;
} => {
  const initialRawSudokuBoard: RawSudokuBoard = makepuzzle();
  const sudokuBoardState: SudokuBoardState = buildSudokuBoardState(
    initialRawSudokuBoard,
  );

  return { initialRawSudokuBoard, sudokuBoardState };
};

const Home = () => {
  const newPuzzle = getNewPuzzle();

  const [initialRawSudokuBoard, setInitialRawSudokuBoard] = useState(
    newPuzzle.initialRawSudokuBoard,
  );
  const [inputMode, setInputMode] = useState<InputMode>("Digit");
  const [isMultiselectMode, setIsMultiselectMode] = useState<boolean>(false);
  const [currentSudokuBoard, setCurrentSudokuBoard] = useState(
    newPuzzle.sudokuBoardState,
  );
  const [_puzzleHistory, setPuzzleHistory] = useState<PuzzleHistory>([
    newPuzzle.sudokuBoardState,
  ]);

  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap={{ base: "4", md: "8" }}
    >
      <SudokuGrid
        currentSudokuBoard={currentSudokuBoard}
        isMultiselectMode={isMultiselectMode}
        setCurrentSudokuBoard={setCurrentSudokuBoard}
      />
      <PlayerInterface
        initialRawSudokuBoard={initialRawSudokuBoard}
        inputMode={inputMode}
        isMultiselectMode={isMultiselectMode}
        setCurrentSudokuBoard={setCurrentSudokuBoard}
        setInitialRawSudokuBoard={setInitialRawSudokuBoard}
        setInputMode={setInputMode}
        setIsMultiselectMode={setIsMultiselectMode}
        setPuzzleHistory={setPuzzleHistory}
      />
    </Flex>
  );
};

export default Home;
