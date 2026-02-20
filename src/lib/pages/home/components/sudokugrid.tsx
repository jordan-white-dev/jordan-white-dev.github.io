import {
  Button,
  SimpleGrid,
  type SimpleGridProps,
  Square,
  type SquareProps,
} from "@chakra-ui/react";

import type { Cell, CellContents, SudokuBoard } from "..";

const CELL_SIZE: SquareProps["minWidth"] = {
  base: "1.938rem", // 31px
  sm: "3.188rem", // 51px
  md: "5rem", // 80px
};
const BOX_SIZE: SimpleGridProps["width"] = {
  base: "6.438rem", // 103px
  sm: "9.813rem", // 157px
  md: "15.25rem", // 244px
};
const GRID_SIZE: SimpleGridProps["minWidth"] = {
  base: "19.563rem", // 313px
  sm: "29.688rem", // 475px
  md: "46rem", // 736px
};
const THIN_BORDER: SquareProps["border"] = "1px solid black";
const THICK_BORDER: SquareProps["border"] = "2px solid black";

type SudokuCellProps = {
  cellContents: CellContents;
};

const SudokuCell = ({ cellContents: sudokuCell }: SudokuCellProps) => {
  const getDisplayValue = (sudokuCell: CellContents): string => {
    if ("startingDigit" in sudokuCell)
      return sudokuCell.startingDigit as string;
    if ("playerDigit" in sudokuCell) return sudokuCell.playerDigit as string;
    return "";
  };

  const displayValue = getDisplayValue(sudokuCell);
  return (
    <Square
      aspectRatio="square"
      border={THIN_BORDER}
      minHeight={CELL_SIZE}
      minWidth={CELL_SIZE}
    >
      <Button
        backgroundColor="transparent"
        borderRadius="0"
        borderWidth="0"
        color="black" // TODO: "#1d6ae5"
        height={CELL_SIZE}
        padding="0"
        textStyle={{
          base: "2xl",
          sm: "4xl",
          md: "6xl",
        }}
        width={CELL_SIZE}
      >
        {displayValue}
      </Button>
    </Square>
  );
};

type SudokuBoxProps = {
  boxCells: Array<Cell>;
};

const SudokuBox = ({ boxCells }: SudokuBoxProps) => (
  <SimpleGrid
    border={THICK_BORDER}
    columns={3}
    gap="0"
    height={BOX_SIZE}
    width={BOX_SIZE}
  >
    {boxCells.map((cell) => (
      <SudokuCell key={cell.cellNumber} cellContents={cell.contents} />
    ))}
  </SimpleGrid>
);

type SudokuGridProps = {
  currentSudokuBoard: SudokuBoard;
};

export const SudokuGrid = ({ currentSudokuBoard }: SudokuGridProps) => {
  const sudokuBoxes = Array.from({ length: 9 }, (_, i) =>
    currentSudokuBoard.cells
      .filter((cell) => cell.boxNumber === i + 1)
      .sort(
        (a, b) => a.rowNumber - b.rowNumber || a.columnNumber - b.columnNumber,
      ),
  );

  return (
    <SimpleGrid
      border={THICK_BORDER}
      columns={3}
      gap="0"
      minHeight={GRID_SIZE}
      minWidth={GRID_SIZE}
    >
      {sudokuBoxes.map((boxCells) => (
        <SudokuBox key={`${boxCells[0].boxNumber}`} boxCells={boxCells} />
      ))}
    </SimpleGrid>
  );
};
