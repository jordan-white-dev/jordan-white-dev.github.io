import { createFileRoute, redirect } from "@tanstack/react-router";
import { makepuzzle } from "sudoku";

import {
  encodeRawPuzzleStringAsBase36String,
  getRawPuzzleStringFromRawBoardState,
} from "@/lib/pages/home/utils/constants";
import type { RawBoardState } from "@/lib/pages/home/utils/types";

export const Route = createFileRoute("/")({
  loader: () => {
    const rawBoardState: RawBoardState = makepuzzle();
    const rawPuzzleString = getRawPuzzleStringFromRawBoardState(rawBoardState);
    const encoded = encodeRawPuzzleStringAsBase36String(rawPuzzleString);

    throw redirect({
      to: "/puzzle/$encoded",
      params: { encoded },
      replace: true,
    });
  },
});
