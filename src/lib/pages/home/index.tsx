import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { makepuzzle } from "sudoku";

import { PlayerInterface } from "./components/playerinterface";
import { SudokuGrid } from "./components/sudokugrid";
import type { MarkupColor } from "./components/svgs";

// #region Types
type SudokuDigit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type StartingDigitCellContents = {
  startingDigit: SudokuDigit;
};
type PlayerDigitCellContents = {
  playerDigit: SudokuDigit | "";
};
type MarkupCellContents = {
  centerMarkups: Array<SudokuDigit>;
  colorMarkups: MarkupColor;
  cornerMarkups: Array<SudokuDigit>;
};
export type CellContents =
  | StartingDigitCellContents
  | PlayerDigitCellContents
  | MarkupCellContents;
export type Cell = {
  boxNumber: number;
  cellNumber: number;
  columnNumber: number;
  cellContents: CellContents;
  isSelected: boolean;
  rowNumber: number;
};
export type SudokuBoard = Array<Cell>;

type RawSudokuBoard = Array<number | null>;

export const inputModes = ["Digit", "Color", "Center", "Corner"] as const;
export type InputMode = (typeof inputModes)[number];
// #endregion

const makeNewPuzzleSudokuBoard = (): SudokuBoard => {
  const sudokuBoard: SudokuBoard = [];
  const rawSudokuBoard: RawSudokuBoard = makepuzzle();

  for (let cellNumber = 1; cellNumber <= 81; cellNumber++) {
    const rowNumber = Math.floor((cellNumber - 1) / 9) + 1;
    const columnNumber = ((cellNumber - 1) % 9) + 1;
    const boxNumber =
      Math.floor((rowNumber - 1) / 3) * 3 +
      Math.floor((columnNumber - 1) / 3) +
      1;

    const rawSudokuBoardCell = rawSudokuBoard[cellNumber - 1];

    const cellContents: CellContents =
      rawSudokuBoardCell === null
        ? { playerDigit: "" }
        : { startingDigit: (rawSudokuBoardCell + 1).toString() as SudokuDigit };

    sudokuBoard.push({
      boxNumber,
      cellNumber,
      columnNumber,
      cellContents,
      isSelected: false,
      rowNumber,
    });
  }

  return sudokuBoard;
};

const Home = () => {
  const [inputMode, setInputMode] = useState<InputMode>("Digit");
  const [isMultiselectMode, setIsMultiselectMode] = useState<boolean>(false);
  // const [selectedCells, setSelectedCells] = useState();
  const [currentSudokuBoard, _setCurrentSudokuBoard] = useState(
    makeNewPuzzleSudokuBoard(),
  );
  // const [movesHistory, setMovesHistory] = useState();

  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap={{ base: "4", md: "8" }}
    >
      <SudokuGrid currentSudokuBoard={currentSudokuBoard} />
      <PlayerInterface
        inputMode={inputMode}
        isMultiselectMode={isMultiselectMode}
        setInputMode={setInputMode}
        setIsMultiselectMode={setIsMultiselectMode}
      />
    </Flex>
  );
};

export default Home;
