import { Box } from "@chakra-ui/react";
import { useLoaderData } from "@tanstack/react-router";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
} from "react";
import useLocalStorageState from "use-local-storage-state";

import type { BoardState, RawBoardState } from "@/lib/shared/types";

import { SudokuStopwatchProvider } from "../../utils/useSudokuStopwatch";
import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";

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
  const [userSettings, setUserSettings] = useLocalStorageState<UserSettings>(
    "user-settings",
    {
      defaultValue: defaultSettings,
    },
  );

  const value = useMemo(
    () => ({
      userSettings,
      setUserSettings,
    }),
    [userSettings, setUserSettings],
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

  return (
    <UserSettingsProvider>
      <SudokuStopwatchProvider>
        <Header />
        <Box width="full" as="main" justifyItems="center" marginY={22}>
          <Puzzle
            key={JSON.stringify(rawBoardState)}
            rawBoardState={rawBoardState}
            startingBoardState={boardState}
          />
        </Box>
      </SudokuStopwatchProvider>
    </UserSettingsProvider>
  );
};

export default Home;
