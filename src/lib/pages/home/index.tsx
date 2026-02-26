import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { makepuzzle } from "sudoku";

import { Board } from "./components/board";
import { PlayerInterface } from "./components/playerinterface";
import type { MarkupColor } from "./components/svgs";

// #region Types
export const inputModes = ["Digit", "Color", "Center", "Corner"] as const;
export type InputMode = (typeof inputModes)[number];

export type RawStartingDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type RawCellState = RawStartingDigit | null;
export type RawBoardState = Array<RawCellState>;

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

export type StartingDigit = { startingDigit: SudokuDigit };
export type PlayerDigit = { playerDigit: SudokuDigit | "" };
export type MarkupDigits = {
  centerMarkups: [""] | Array<SudokuDigit>;
  cornerMarkups: [""] | Array<SudokuDigit>;
};
export type CellContent = StartingDigit | PlayerDigit | MarkupDigits;

export type CellState = {
  boxNumber: number;
  cellContent: CellContent;
  cellNumber: number;
  columnNumber: number;
  isSelected: boolean;
  markupColors: [""] | Array<MarkupColor>;
  rowNumber: number;
};

export type BoardState = Array<CellState>;

export type PuzzleHistory = {
  currentBoardStateIndex: number;
  boardStateHistory: Array<BoardState>;
};
// #endregion

// #region Board State
export const buildBoardState = (rawBoardState: RawBoardState): BoardState => {
  const boardState: BoardState = [];

  for (let cellNumber = 1; cellNumber <= 81; cellNumber++) {
    const rowNumber = Math.floor((cellNumber - 1) / 9) + 1;
    const columnNumber = ((cellNumber - 1) % 9) + 1;
    const boxNumber =
      Math.floor((rowNumber - 1) / 3) * 3 +
      Math.floor((columnNumber - 1) / 3) +
      1;

    const rawCellState = rawBoardState[cellNumber - 1];

    const blankPlayerDigitCellContent: PlayerDigit = { playerDigit: "" };

    const getStartingDigitCellContent = (rawCellState: RawStartingDigit) => ({
      startingDigit: (rawCellState + 1).toString() as SudokuDigit,
    });

    const cellContent: CellContent =
      rawCellState === null
        ? blankPlayerDigitCellContent
        : getStartingDigitCellContent(rawCellState);

    const cellState: CellState = {
      boxNumber,
      cellContent,
      cellNumber,
      columnNumber,
      isSelected: false,
      markupColors: [""],
      rowNumber,
    };

    boardState.push(cellState);
  }

  return boardState;
};

type StartingBoardStates = {
  rawBoardState: RawBoardState;
  boardState: BoardState;
};

export const getNewStartingBoardStates = (): StartingBoardStates => {
  const rawBoardState: RawBoardState = makepuzzle();
  const boardState: BoardState = buildBoardState(rawBoardState);

  const startingBoardStates = { rawBoardState, boardState };

  return startingBoardStates;
};
// #endregion

const Home = () => {
  const newStartingBoardStates = getNewStartingBoardStates();
  const [startingRawBoardState, setStartingRawBoardState] = useState(
    newStartingBoardStates.rawBoardState,
  );
  const [inputMode, setInputMode] = useState<InputMode>("Digit");
  const [isMultiselectMode, setIsMultiselectMode] = useState(false);
  const [puzzleHistory, setPuzzleHistory] = useState<PuzzleHistory>({
    currentBoardStateIndex: 0,
    boardStateHistory: [newStartingBoardStates.boardState],
  });

  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap={{ base: "4", md: "8" }}
    >
      <Board
        isMultiselectMode={isMultiselectMode}
        puzzleHistory={puzzleHistory}
        setPuzzleHistory={setPuzzleHistory}
      />
      <PlayerInterface
        inputMode={inputMode}
        isMultiselectMode={isMultiselectMode}
        puzzleHistory={puzzleHistory}
        startingRawBoardState={startingRawBoardState}
        setInputMode={setInputMode}
        setIsMultiselectMode={setIsMultiselectMode}
        setPuzzleHistory={setPuzzleHistory}
        setStartingRawBoardState={setStartingRawBoardState}
      />
    </Flex>
  );
};

export default Home;
