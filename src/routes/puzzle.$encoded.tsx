import { createFileRoute, notFound } from "@tanstack/react-router";
import { solvepuzzle } from "sudoku";

import Home from "@/lib/pages/home";
import { getBoardStateFromRawBoardState } from "@/lib/pages/home/utils/constants";
import {
  isRawPuzzleString,
  isRawStartingDigit,
  type RawBoardState,
  type RawPuzzleString,
} from "@/lib/pages/home/utils/types";

const decodeBase36StringAsRawPuzzleString = (
  base36String: string,
): RawPuzzleString => {
  const base36StringAsBigInt = [...base36String.toLowerCase()].reduce(
    (accumulatedDecimalValue, currentCharacter, characterIndex) => {
      const base36Alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

      const digitIndexInAlphabet = base36Alphabet.indexOf(currentCharacter);
      const isCharacterAValidBase36Digit = digitIndexInAlphabet !== -1;

      if (!isCharacterAValidBase36Digit)
        throw Error(
          `Encountered an invalid base36 character - "${currentCharacter}" - at position ${characterIndex}`,
        );

      return accumulatedDecimalValue * 36n + BigInt(digitIndexInAlphabet);
    },
    0n,
  );

  const candidateRawPuzzleString = base36StringAsBigInt
    .toString()
    .padStart(81, "0");

  if (!isRawPuzzleString(candidateRawPuzzleString))
    throw Error("Decoded value is an invalid raw puzzle string.");

  return candidateRawPuzzleString;
};

const getRawBoardStateFromRawPuzzleString = (
  rawPuzzleString: RawPuzzleString,
): RawBoardState => {
  const rawBoardState = [...rawPuzzleString].map((character) => {
    if (character === "0") return null;

    const candidateRawStartingDigit = Number(character) - 1;

    if (!isRawStartingDigit(candidateRawStartingDigit))
      throw Error(
        `Encountered an invalid raw starting digit - "${candidateRawStartingDigit}" - while decoding the raw puzzle string.`,
      );

    return candidateRawStartingDigit;
  });

  return rawBoardState;
};

export const Route = createFileRoute("/puzzle/$encoded")({
  loader: ({ params }) => {
    const rawPuzzleString = (() => {
      try {
        const decodedRawPuzzleString = decodeBase36StringAsRawPuzzleString(
          params.encoded,
        );

        return decodedRawPuzzleString;
      } catch {
        throw notFound();
      }
    })();

    const rawBoardState = (() => {
      try {
        const rawBoardState =
          getRawBoardStateFromRawPuzzleString(rawPuzzleString);

        return rawBoardState;
      } catch {
        throw notFound();
      }
    })();

    const isPuzzleSolvable = solvepuzzle(rawBoardState);
    if (!isPuzzleSolvable) throw notFound();

    const boardState = getBoardStateFromRawBoardState(rawBoardState);

    const loaderData = {
      boardState,
      rawBoardState,
    };

    return loaderData;
  },

  component: Home,
});
