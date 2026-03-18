import { createFileRoute, redirect } from "@tanstack/react-router";
import { makepuzzle } from "sudoku";

import {
  encodeRawSudokuStringAsBase36String,
  rawBoardStateToRawSudokuString,
} from "@/lib/pages/home/utils/constants";
import type { RawBoardState } from "@/lib/pages/home/utils/types";

export const Route = createFileRoute("/")({
  loader: () => {
    const rawBoardState: RawBoardState = makepuzzle();
    const rawSudokuString = rawBoardStateToRawSudokuString(rawBoardState);
    const encoded = encodeRawSudokuStringAsBase36String(rawSudokuString);

    throw redirect({
      to: "/puzzle/$encoded",
      params: { encoded },
      replace: true,
    });
  },
});
