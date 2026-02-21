import {
  Button,
  type ButtonProps,
  SimpleGrid,
  type SimpleGridProps,
  Square,
  type SquareProps,
} from "@chakra-ui/react";

import type { Cell, CellContents, SudokuBoard } from "..";

const CELL_SIZE: SquareProps["minWidth"] = {
  base: "31px",
  sm: "3.188rem", // 51px
  md: "5rem", // 80px
};
const CELL_OUTLINE: ButtonProps["outline"] = {
  base: "3px solid #4ca4ff",
  sm: "5px solid #4ca4ff",
  md: "8px solid #4ca4ff",
};
const CELL_OUTLINE_OFFSET: ButtonProps["outlineOffset"] = {
  base: "-3px",
  sm: "-6px",
  md: "-9px",
};
const TEXT_STYLE: ButtonProps["textStyle"] = {
  base: "2xl",
  sm: "4xl",
  md: "6xl",
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
  sudokuCell: Cell;
};

const SudokuCell = ({ sudokuCell }: SudokuCellProps) => {
  const getDisplayValue = (contents: CellContents): string => {
    if ("startingDigit" in contents) return contents.startingDigit as string;
    if ("playerDigit" in contents) return contents.playerDigit as string;
    return "";
  };

  const displayValue = getDisplayValue(sudokuCell.contents);
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
        minWidth={CELL_SIZE}
        padding="0"
        textStyle={TEXT_STYLE}
        width={CELL_SIZE}
        {...(sudokuCell.isSelected && {
          outline: CELL_OUTLINE,
          outlineOffset: CELL_OUTLINE_OFFSET,
        })}
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
    {boxCells.map((sudokuCell) => (
      <SudokuCell key={sudokuCell.cellNumber} sudokuCell={sudokuCell} />
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
