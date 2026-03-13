import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useStopwatch } from "react-timer-hook";
import useSessionStorageState from "use-session-storage-state";

import type { RawBoardState } from "../shared/types";
import { useUserSettings } from "./useUserSettings";

// #region Helper Functions
const getFormattedStopwatchMinutes = (hours: number, minutes: number) => {
  if (hours >= 1) {
    const hoursConvertedToMinutes = hours * 60;
    const totalMinutes = minutes + hoursConvertedToMinutes;

    return String(totalMinutes).padStart(3, "0");
  }

  return String(minutes).padStart(2, "0");
};

const getOffsetDateFromTotalSeconds = (totalSeconds: number): Date => {
  const offsetDate = new Date();
  offsetDate.setSeconds(offsetDate.getSeconds() + totalSeconds);

  return offsetDate;
};
// #endregion

// #region Context
type SudokuStopwatchContextValue = {
  formattedStopwatchTime: string;
  isStopwatchRunning: boolean;
  pauseStopwatch: () => void;
  pauseStopwatchAndDisable: () => void;
  resetStopwatch: () => void;
  resumeStopwatchAndEnable: () => void;
  startStopwatch: () => void;
  startStopwatchIfEnabled: () => void;
};

const SudokuStopwatchContext = createContext<
  SudokuStopwatchContextValue | undefined
>(undefined);
// #endregion

// #region Provider
export const SudokuStopwatchProvider = ({
  children,
  rawBoardState,
}: {
  children: ReactNode;
  rawBoardState: RawBoardState;
}) => {
  const { userSettings, setUserSettings } = useUserSettings();

  const [persistedStopwatchTotalSeconds, setPersistedStopwatchTotalSeconds] =
    useSessionStorageState<number>(
      `sudoku-stopwatch-persisted-total-seconds-${JSON.stringify(rawBoardState)}`,
      {
        defaultValue: 0,
      },
    );

  // #region Stopwatch Hook
  const {
    hours,
    isRunning: isStopwatchRunning,
    minutes,
    seconds,
    totalSeconds,
    pause: pauseStopwatch,
    reset,
    start,
  } = useStopwatch({
    autoStart: false,
    interval: 500,
    offsetDate: getOffsetDateFromTotalSeconds(persistedStopwatchTotalSeconds),
  });
  // #endregion

  // #region Stopwatch Persistence
  const hasHydratedStopwatchFromSessionStorageRef = useRef(false);

  useEffect(() => {
    if (hasHydratedStopwatchFromSessionStorageRef.current) return;

    hasHydratedStopwatchFromSessionStorageRef.current = true;

    const hydratedOffsetDate = getOffsetDateFromTotalSeconds(
      persistedStopwatchTotalSeconds,
    );

    reset(hydratedOffsetDate, !userSettings.disableStopwatch);
  }, [persistedStopwatchTotalSeconds, userSettings.disableStopwatch, reset]);

  useEffect(
    () => setPersistedStopwatchTotalSeconds(totalSeconds),
    [totalSeconds, setPersistedStopwatchTotalSeconds],
  );
  // #endregion

  // #region Stopwatch Visibility + Disabled State
  const isStopwatchRunningRef = useRef(isStopwatchRunning);
  const disableStopwatchRef = useRef(userSettings.disableStopwatch);

  useEffect(() => {
    isStopwatchRunningRef.current = isStopwatchRunning;
  }, [isStopwatchRunning]);

  useEffect(() => {
    disableStopwatchRef.current = userSettings.disableStopwatch;
  }, [userSettings.disableStopwatch]);

  const wasStopwatchRunningBeforePageWasHiddenRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasStopwatchRunningBeforePageWasHiddenRef.current =
          isStopwatchRunningRef.current;

        if (isStopwatchRunningRef.current) {
          pauseStopwatch();
        }

        return;
      }

      const shouldResumeStopwatch =
        wasStopwatchRunningBeforePageWasHiddenRef.current &&
        !disableStopwatchRef.current;

      if (shouldResumeStopwatch) {
        start();
      }

      wasStopwatchRunningBeforePageWasHiddenRef.current = false;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseStopwatch, start]);
  // #endregion

  // #region Context Values + Actions
  const formattedStopwatchTime = useMemo(() => {
    const formattedMinutes = getFormattedStopwatchMinutes(hours, minutes);
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }, [hours, minutes, seconds]);

  const pauseStopwatchAndDisable = useCallback(() => {
    pauseStopwatch();
    setUserSettings((previousUserSettings) => ({
      ...previousUserSettings,
      disableStopwatch: true,
    }));
  }, [pauseStopwatch, setUserSettings]);

  const resetStopwatch = useCallback(() => {
    reset(getOffsetDateFromTotalSeconds(0), true);
    setPersistedStopwatchTotalSeconds(0);
  }, [reset, setPersistedStopwatchTotalSeconds]);

  const resumeStopwatchAndEnable = useCallback(() => {
    start();
    setUserSettings((previousUserSettings) => ({
      ...previousUserSettings,
      disableStopwatch: false,
    }));
  }, [setUserSettings, start]);

  const startStopwatch = useCallback(() => start(), [start]);

  const startStopwatchIfEnabled = useCallback(() => {
    if (!userSettings.disableStopwatch) start();
  }, [userSettings.disableStopwatch, start]);

  const sudokuStopwatchValue = useMemo(
    () => ({
      formattedStopwatchTime,
      isStopwatchRunning,
      pauseStopwatch,
      pauseStopwatchAndDisable,
      resetStopwatch,
      resumeStopwatchAndEnable,
      startStopwatch,
      startStopwatchIfEnabled,
    }),
    [
      formattedStopwatchTime,
      isStopwatchRunning,
      pauseStopwatch,
      pauseStopwatchAndDisable,
      resetStopwatch,
      resumeStopwatchAndEnable,
      startStopwatch,
      startStopwatchIfEnabled,
    ],
  );
  // #endregion

  return (
    <SudokuStopwatchContext.Provider value={sudokuStopwatchValue}>
      {children}
    </SudokuStopwatchContext.Provider>
  );
};
// #endregion

// #region Hook
export const useSudokuStopwatch = () => {
  const sudokuStopwatchContext = useContext(SudokuStopwatchContext);

  if (!sudokuStopwatchContext)
    throw Error(
      "useSudokuStopwatch must be used inside SudokuStopwatchProvider",
    );

  return sudokuStopwatchContext;
};
// #endregion
