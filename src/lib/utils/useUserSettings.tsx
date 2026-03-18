import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useMemo,
} from "react";
import useSessionStorageState from "use-session-storage-state";

export type UserSettings = {
  conflictChecker: boolean;
  dashedGrid: boolean;
  disableStopwatch: boolean;
  flipKeypad: boolean;
  hideStopwatch: boolean;
  showRowAndColumnLabels: boolean;
  showSeenCells: boolean;
  strictHighlights: boolean;
};

type UserSettingsContextValue = {
  userSettings: UserSettings;
  setUserSettings: Dispatch<SetStateAction<UserSettings>>;
};

const defaultSettings: UserSettings = {
  conflictChecker: false,
  dashedGrid: false,
  disableStopwatch: false,
  flipKeypad: false,
  hideStopwatch: false,
  showRowAndColumnLabels: false,
  showSeenCells: false,
  strictHighlights: false,
};

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(
  undefined,
);

export const UserSettingsProvider = ({ children }: PropsWithChildren) => {
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
