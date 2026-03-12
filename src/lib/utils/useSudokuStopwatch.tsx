import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useStopwatch } from "react-timer-hook";

import { useUserSettings } from "./useUserSettings";

type SudokuStopwatchContextValue = {
  isStopwatchRunning: boolean;
  formattedStopwatchTime: string;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
  startStopwatch: () => void;
  startStopwatchIfEnabled: () => void;
  resumeStopwatchAndEnable: () => void;
  pauseStopwatchAndDisable: () => void;
};

const SudokuStopwatchContext = createContext<
  SudokuStopwatchContextValue | undefined
>(undefined);

const getFormattedStopwatchMinutes = (
  elapsedHours: number,
  elapsedMinutes: number,
) => {
  if (elapsedHours >= 1) {
    const hoursConvertedToMinutes = elapsedHours * 60;
    const totalElapsedMinutes = elapsedMinutes + hoursConvertedToMinutes;

    return String(totalElapsedMinutes).padStart(3, "0");
  }

  return String(elapsedMinutes).padStart(2, "0");
};

export const SudokuStopwatchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { userSettings, setUserSettings } = useUserSettings();

  const {
    hours: elapsedHours,
    isRunning: isStopwatchRunning,
    minutes: elapsedMinutes,
    seconds: elapsedSeconds,
    pause: pauseStopwatch,
    reset,
    start,
  } = useStopwatch({
    interval: 500,
  });

  const resetStopwatch = useCallback(() => {
    reset();
  }, [reset]);

  const startStopwatch = useCallback(() => {
    start();
  }, [start]);

  const formattedStopwatchTime = useMemo(() => {
    const formattedMinutes = getFormattedStopwatchMinutes(
      elapsedHours,
      elapsedMinutes,
    );
    const formattedSeconds = String(elapsedSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }, [elapsedHours, elapsedMinutes, elapsedSeconds]);

  const startStopwatchIfEnabled = useCallback(() => {
    if (!userSettings.disableStopwatch) {
      startStopwatch();
    }
  }, [userSettings.disableStopwatch, startStopwatch]);

  const resumeStopwatchAndEnable = useCallback(() => {
    startStopwatch();

    setUserSettings((previousUserSettings) => ({
      ...previousUserSettings,
      disableStopwatch: false,
    }));
  }, [setUserSettings, startStopwatch]);

  const pauseStopwatchAndDisable = useCallback(() => {
    pauseStopwatch();

    setUserSettings((previousUserSettings) => ({
      ...previousUserSettings,
      disableStopwatch: true,
    }));
  }, [pauseStopwatch, setUserSettings]);

  const sudokuStopwatchValue = useMemo(
    () => ({
      isStopwatchRunning,
      formattedStopwatchTime,
      pauseStopwatch,
      resetStopwatch,
      startStopwatch,
      startStopwatchIfEnabled,
      resumeStopwatchAndEnable,
      pauseStopwatchAndDisable,
    }),
    [
      isStopwatchRunning,
      formattedStopwatchTime,
      pauseStopwatch,
      resetStopwatch,
      startStopwatch,
      startStopwatchIfEnabled,
      resumeStopwatchAndEnable,
      pauseStopwatchAndDisable,
    ],
  );

  return (
    <SudokuStopwatchContext.Provider value={sudokuStopwatchValue}>
      {children}
    </SudokuStopwatchContext.Provider>
  );
};

export const useSudokuStopwatch = () => {
  const sudokuStopwatchContext = useContext(SudokuStopwatchContext);

  if (!sudokuStopwatchContext) {
    throw Error(
      "useSudokuStopwatch must be used inside SudokuStopwatchProvider",
    );
  }

  return sudokuStopwatchContext;
};
