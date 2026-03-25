import {
  type CellContent,
  type MarkupColor,
  type MarkupDigits,
  type SudokuDigit,
} from "@/lib/pages/home/model/types";
import { isSudokuDigit } from "@/lib/pages/home/model/validators";

// #region Cell Content Guards
export const isStartingDigitInCellContent = (cellContent: CellContent) =>
  "startingDigit" in cellContent;

export const isPlayerDigitInCellContent = (cellContent: CellContent) =>
  "playerDigit" in cellContent;

export const isMarkupDigitsInCellContent = (cellContent: CellContent) =>
  "centerMarkups" in cellContent && "cornerMarkups" in cellContent;

export const isStartingOrPlayerDigitInCellContent = (
  cellContent: CellContent,
) => "playerDigit" in cellContent || "startingDigit" in cellContent;
// #endregion

// #region Array Guards
export const isArrayOfSudokuDigits = (
  values: MarkupDigits,
): values is Array<SudokuDigit> =>
  values.length > 0 && values.every((value) => isSudokuDigit(value));

export const isArrayOfMarkupColors = (
  values: [""] | Array<MarkupColor>,
): values is Array<MarkupColor> => values[0] !== "";
// #endregion

// #region Exhaustive Guard
export const exhaustiveGuard = (_value: never): never => {
  throw Error(
    `Reached the exhaustive guard function with an unexpected value: ${JSON.stringify(_value)}`,
  );
};
// #endregion
