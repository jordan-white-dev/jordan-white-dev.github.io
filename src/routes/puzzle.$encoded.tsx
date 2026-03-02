import { createFileRoute, notFound } from "@tanstack/react-router";
import { solvepuzzle } from "sudoku";

import Home from "@/lib/pages/home";
import {
  buildBoardState,
  decodeBase36StringAsRawSudokuString,
  rawSudokuStringToRawBoardState,
  validRawSudokuStringRegEx,
} from "@/lib/shared/constants";

export const Route = createFileRoute("/puzzle/$encoded")({
  loader: ({ params }) => {
    const rawSudokuString = (() => {
      try {
        return decodeBase36StringAsRawSudokuString(params.encoded)
          .toString()
          .padStart(81, "0");
      } catch {
        throw notFound();
      }
    })();

    if (!validRawSudokuStringRegEx.test(rawSudokuString)) throw notFound();

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
