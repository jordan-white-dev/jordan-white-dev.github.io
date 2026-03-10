import { Box } from "@chakra-ui/react";
import { useLoaderData } from "@tanstack/react-router";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { useStopwatch } from "react-timer-hook";

import type { BoardState, RawBoardState } from "@/lib/shared/types";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";
import {
  StopwatchCommandsProvider,
  StopwatchTimeProvider,
} from "./components/stopwatch";

// #region User Settings
export type UserSettings = {
  conflictChecker: boolean;
  showSeenCells: boolean;
  flipKeypad: boolean;
  disableStopwatch: boolean;
  dashedGrid: boolean;
  showRowAndColumnLabels: boolean;
};

type UserSettingsContextValue = {
  userSettings: UserSettings;
  setUserSettings: Dispatch<SetStateAction<UserSettings>>;
};

const defaultSettings: UserSettings = {
  conflictChecker: false,
  showSeenCells: false,
  flipKeypad: false,
  disableStopwatch: false,
  dashedGrid: false,
  showRowAndColumnLabels: false,
};

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(
  undefined,
);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [userSettings, setUserSettings] =
    useState<UserSettings>(defaultSettings);

  const value = useMemo(
    () => ({
      userSettings,
      setUserSettings,
    }),
    [userSettings],
  );

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw Error("useUserSettings must be used inside UserSettingsProvider");
  }

  return context;
};
// #endregion

type LoaderData = {
  rawBoardState: RawBoardState;
  boardState: BoardState;
};

const Home = () => {
  const { rawBoardState, boardState } = useLoaderData({
    from: "/puzzle/$encoded",
  }) as LoaderData;

  const { hours, isRunning, minutes, seconds, pause, reset, start } =
    useStopwatch({
      interval: 500,
    });

  const stopwatchCommandsValue = useMemo(
    () => ({ pause, reset, start }),
    [pause, reset, start],
  );

  const stopwatchTimeValue = useMemo(() => {
    const getPaddedMinutes = () => {
      if (hours >= 1) {
        const hoursToMinutes = 60 * hours;
        const totalMinutes = minutes + hoursToMinutes;
        const paddedTotalMinutesAsString = `${String(totalMinutes).padStart(3, "0")}`;
        return paddedTotalMinutesAsString;
      } else return `${String(minutes).padStart(2, "0")}`;
    };

    const paddedMinutes = getPaddedMinutes();
    const paddedSeconds = `${String(seconds).padStart(2, "0")}`;
    const stopwatchTime = `${paddedMinutes}:${paddedSeconds}`;

    return { isRunning, stopwatchTime };
  }, [isRunning, hours, minutes, seconds]);

  return (
    <UserSettingsProvider>
      <StopwatchCommandsProvider value={stopwatchCommandsValue}>
        <StopwatchTimeProvider value={stopwatchTimeValue}>
          <Header />
          <Box width="full" as="main" justifyItems="center" marginY={22}>
            <Puzzle
              key={JSON.stringify(rawBoardState)}
              rawBoardState={rawBoardState}
              startingBoardState={boardState}
            />
          </Box>
        </StopwatchTimeProvider>
      </StopwatchCommandsProvider>
    </UserSettingsProvider>
  );
};

export default Home;
