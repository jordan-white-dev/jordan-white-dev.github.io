import {
  Button,
  type ButtonProps,
  SimpleGrid,
  type SimpleGridProps,
  type SquareProps,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";

import type { Cell, CellContent, SudokuBoardState } from "..";

// #region CSS Properties
const CELL_SIZE: SquareProps["minWidth"] = {
  base: "33px",
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
// #endregion

// #region Sudoku Cell
type SudokuCellProps = {
  cell: Cell;
  isMultiselectMode: boolean;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
};

const SudokuCell = ({
  cell,
  isMultiselectMode,
  setCurrentSudokuBoard,
}: SudokuCellProps) => {
  const getStartingOrPlayerDigitDisplayValue = (
    cellContent: CellContent,
  ): string => {
    if ("startingDigit" in cellContent) {
      return cellContent.startingDigit;
    } else if ("playerDigit" in cellContent) {
      return cellContent.playerDigit;
    }
    return "";
  };
  const displayValue = getStartingOrPlayerDigitDisplayValue(cell.cellContent);

  const digitColor = "startingDigit" in cell.cellContent ? "black" : "#1d6ae5";

  const cellBackgroundColor =
    cell.markupColor !== "" ? cell.markupColor : "transparent";

  const handleCellSelection = () => {
    setCurrentSudokuBoard((currentSudokuBoard) => {
      const selectedCells = currentSudokuBoard.filter(
        (boardCell) => boardCell.isSelected,
      );

      return currentSudokuBoard.map((boardCell) => {
        const newIsSelectedForMultiselect =
          boardCell.cellNumber === cell.cellNumber
            ? !boardCell.isSelected
            : boardCell.isSelected;

        const isOnlySelectedCell =
          selectedCells.length === 1 &&
          selectedCells[0].cellNumber === cell.cellNumber;

        const newIsSelectedForSingleSelect =
          boardCell.cellNumber === cell.cellNumber
            ? !isOnlySelectedCell
            : false;

        const newIsSelected = isMultiselectMode
          ? newIsSelectedForMultiselect
          : newIsSelectedForSingleSelect;

        return { ...boardCell, isSelected: newIsSelected };
      });
    });
  };

  return (
    <Button
      backgroundColor={cellBackgroundColor}
      border={THIN_BORDER}
      borderRadius="0"
      color={digitColor}
      height={CELL_SIZE}
      minWidth={CELL_SIZE}
      padding="0"
      textStyle={TEXT_STYLE}
      width={CELL_SIZE}
      {...(cell.isSelected && {
        outline: CELL_OUTLINE,
        outlineOffset: CELL_OUTLINE_OFFSET,
      })}
      onClick={handleCellSelection}
    >
      {displayValue}
    </Button>
  );
};
// #endregion

// #region Sudoku Box
type SudokuBoxProps = {
  boxCells: Array<Cell>;
  isMultiselectMode: boolean;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
};

const SudokuBox = ({
  boxCells,
  isMultiselectMode,
  setCurrentSudokuBoard,
}: SudokuBoxProps) => (
  <SimpleGrid
    border={THICK_BORDER}
    columns={3}
    gap="0"
    height={BOX_SIZE}
    width={BOX_SIZE}
  >
    {boxCells.map((cell) => (
      <SudokuCell
        key={cell.cellNumber}
        cell={cell}
        isMultiselectMode={isMultiselectMode}
        setCurrentSudokuBoard={setCurrentSudokuBoard}
      />
    ))}
  </SimpleGrid>
);
// #endregion

type SudokuGridProps = {
  currentSudokuBoard: SudokuBoardState;
  isMultiselectMode: boolean;
  setCurrentSudokuBoard: Dispatch<SetStateAction<SudokuBoardState>>;
};

type CellsByBox = Array<Array<Cell>>;

export const SudokuGrid = ({
  currentSudokuBoard,
  isMultiselectMode,
  setCurrentSudokuBoard,
}: SudokuGridProps) => {
  const emptyBoxes: CellsByBox = Array.from({ length: 9 }, () => []);

  const sudokuBoxes = currentSudokuBoard.reduce<CellsByBox>((boxes, cell) => {
    boxes[cell.boxNumber - 1].push(cell);
    return boxes;
  }, emptyBoxes);

  return (
    <SimpleGrid
      border={THICK_BORDER}
      columns={3}
      gap="0"
      minHeight={GRID_SIZE}
      minWidth={GRID_SIZE}
    >
      {sudokuBoxes.map((boxCells) => (
        <SudokuBox
          key={`${boxCells[0].boxNumber}`}
          boxCells={boxCells}
          isMultiselectMode={isMultiselectMode}
          setCurrentSudokuBoard={setCurrentSudokuBoard}
        />
      ))}
    </SimpleGrid>
  );
};
