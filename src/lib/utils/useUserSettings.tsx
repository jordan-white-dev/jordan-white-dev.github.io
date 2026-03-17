import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useMemo,
} from "react";
import useSessionStorageState from "use-session-storage-state";

export type UserSettings = {
  conflictChecker: boolean;
  showSeenCells: boolean;
  strictHighlights: boolean;
  flipKeypad: boolean;
  disableStopwatch: boolean;
  hideStopwatch: boolean;
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
  strictHighlights: false,
  flipKeypad: false,
  disableStopwatch: false,
  hideStopwatch: false,
  dashedGrid: false,
  showRowAndColumnLabels: false,
};

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(
  undefined,
);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [userSettings, setUserSettings] = useSessionStorageState<UserSettings>(
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
