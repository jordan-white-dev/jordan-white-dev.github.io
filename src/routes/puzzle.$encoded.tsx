import { createFileRoute, notFound } from "@tanstack/react-router";
import { solvepuzzle } from "sudoku";

import Home from "@/lib/pages/home";
import {
  buildBoardState,
  validRawSudokuStringRegex,
} from "@/lib/shared/constants";
import type { RawBoardState, RawStartingDigit } from "@/lib/shared/types";

const decodeBase36StringAsRawSudokuString = (base36String: string) => {
  const base36StringAsBigInt = [...base36String.toLowerCase()].reduce(
    (accumulatedDecimalValue, currentCharacter, characterIndex) => {
      const base36Alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

      const currentBase36Character = currentCharacter;
      const currentCharacterPosition = characterIndex;

      const digitIndexInAlphabet = base36Alphabet.indexOf(
        currentBase36Character,
      );
      const characterIsValidBase36Digit = digitIndexInAlphabet !== -1;

      if (!characterIsValidBase36Digit) {
        throw new Error(
          `Invalid base36 character "${currentBase36Character}" at position ${currentCharacterPosition}`,
        );
      }

      const decimalDigitValue = BigInt(digitIndexInAlphabet);

      const accumulatedValueAfterBaseShift = accumulatedDecimalValue * 36n;
      const nextAccumulatedDecimalValue =
        accumulatedValueAfterBaseShift + decimalDigitValue;

      return nextAccumulatedDecimalValue;
    },
    0n,
  );

  return base36StringAsBigInt.toString();
};

const rawSudokuStringToRawBoardState = (
  rawSudokuString: string,
): RawBoardState =>
  [...rawSudokuString].map((character) =>
    character === "0" ? null : ((Number(character) - 1) as RawStartingDigit),
  );

export const Route = createFileRoute("/puzzle/$encoded")({
  loader: ({ params }) => {
    const rawSudokuString = (() => {
      try {
        return decodeBase36StringAsRawSudokuString(params.encoded).padStart(
          81,
          "0",
        );
      } catch {
        throw notFound();
      }
    })();

    if (!validRawSudokuStringRegex.test(rawSudokuString)) throw notFound();

    const rawBoardState = rawSudokuStringToRawBoardState(rawSudokuString);

    const solved = solvepuzzle(rawBoardState);
    if (!solved) throw notFound();

    return {
      rawBoardState,
      boardState: buildBoardState(rawBoardState),
    };
  },

  component: Home,
});
