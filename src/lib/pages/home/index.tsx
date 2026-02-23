import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { makepuzzle } from "sudoku";

import { PlayerInterface } from "./components/playerinterface";
import { SudokuGrid } from "./components/sudokugrid";
import type { ColorInput } from "./components/svgs";

type SudokuDigit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type StartingDigitCell = {
  startingDigit: SudokuDigit;
};
type PlayerDigitCell = {
  playerDigit: SudokuDigit | "";
};
type MarkupCell = {
  centerMarkups: Array<SudokuDigit>;
  colorMarkups: Array<ColorInput>;
  cornerMarkups: Array<SudokuDigit>;
};
export type CellContents = StartingDigitCell | PlayerDigitCell | MarkupCell;
export type Cell = {
  boxNumber: number;
  cellNumber: number;
  columnNumber: number;
  contents: CellContents;
  isSelected: boolean;
  rowNumber: number;
};
export type SudokuBoard = {
  cells: Array<Cell>;
};

type RawPuzzle = Array<number | null>;

const createBlankSudokuBoard = (): SudokuBoard => {
  const cells: SudokuBoard["cells"] = [];
  const rawPuzzle: RawPuzzle = makepuzzle();

  for (let cellNumber = 1; cellNumber <= 81; cellNumber++) {
    const rowNumber = Math.floor((cellNumber - 1) / 9) + 1;
    const columnNumber = ((cellNumber - 1) % 9) + 1;
    const boxNumber =
      Math.floor((rowNumber - 1) / 3) * 3 +
      Math.floor((columnNumber - 1) / 3) +
      1;

    const puzzleValue = rawPuzzle[cellNumber - 1];

    const contents: CellContents =
      puzzleValue === null
        ? { playerDigit: "" }
        : { startingDigit: (puzzleValue + 1).toString() as SudokuDigit };

    cells.push({
      boxNumber,
      cellNumber,
      columnNumber,
      contents,
      isSelected: false,
      rowNumber,
    });
  }

  return { cells };
};

export const inputModes = ["Digit", "Color", "Center", "Corner"] as const;
export type InputMode = (typeof inputModes)[number];

const Home = () => {
  const [inputMode, setInputMode] = useState<InputMode>("Digit");
  const [isMultiselectMode, setIsMultiselectMode] = useState<boolean>(false);
  // const [selectedCells, setSelectedCells] = useState();
  const [currentSudokuBoard, _setCurrentSudokuBoard] = useState(
    createBlankSudokuBoard(),
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
