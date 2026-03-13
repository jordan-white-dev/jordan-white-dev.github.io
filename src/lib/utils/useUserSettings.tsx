import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
} from "react";
import useSessionStorageState from "use-session-storage-state";

import type { RawBoardState } from "../shared/types";

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

export const UserSettingsProvider = ({
  children,
  rawBoardState,
}: {
  children: ReactNode;
  rawBoardState: RawBoardState;
}) => {
  const [userSettings, setUserSettings] = useSessionStorageState<UserSettings>(
    `user-settings-${JSON.stringify(rawBoardState)}`,
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
