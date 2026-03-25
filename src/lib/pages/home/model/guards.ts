import { type CellContent } from "@/lib/pages/home/model/types";

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

// #region Exhaustive Guard
export const exhaustiveGuard = (_value: never): never => {
  throw Error(
    `Reached the exhaustive guard function with an unexpected value: ${JSON.stringify(_value)}`,
  );
};
// #endregion
