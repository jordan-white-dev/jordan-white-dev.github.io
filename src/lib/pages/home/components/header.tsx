import {
  Box,
  Button,
  Flex,
  Group,
  IconButton,
  Kbd,
  Menu,
  Portal,
  VStack,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { ImKeyboard } from "react-icons/im";
import { MdOutlineSettings } from "react-icons/md";

import { useSudokuStopwatch } from "@/lib/pages/home/hooks/use-sudoku-stopwatch";
import {
  type UserSettings,
  useUserSettings,
} from "@/lib/pages/home/hooks/use-user-settings";

import { Stopwatch } from "./stopwatch";
import { Tooltip } from "./tooltip";

// #region Shortcuts Menu
const DoubleClickTooltipText = () => (
  <>
    <Kbd>Double Click</Kbd> &nbsp;selects all cells with matching digits,
    colors, and/or markups. Strict highlighting selects only cells with
    identical contents.
  </>
);
const CtrlTooltipText = () => (
  <>
    <Kbd>Ctrl</Kbd> &nbsp;temporarily switches to center markup mode.
  </>
);
const ShiftTooltipText = () => (
  <>
    <Kbd>Shift</Kbd> &nbsp;temporarily switches to corner markup mode.
  </>
);
const AltTooltipText = () => (
  <>
    <Kbd>Ctrl</Kbd> &nbsp;temporarily switches to color markup mode.
  </>
);
const MultiselectTooltipText = () => (
  <>
    <Kbd>M</Kbd> &nbsp;switches between single select and multiselect modes.
  </>
);

type ShortcutItems = Array<{
  keyboardShortcut: string;
  shortcutName: string;
  tooltipText: ReactNode;
  value: string;
}>;

const nonClearCellShortcutItems: ShortcutItems = [
  {
    keyboardShortcut: "Double Click",
    shortcutName: "Highlight Matches",
    tooltipText: <DoubleClickTooltipText />,
    value: "highlight-matches",
  },
  {
    keyboardShortcut: "Ctrl",
    shortcutName: "Center Markup",
    tooltipText: <CtrlTooltipText />,
    value: "center-markup",
  },
  {
    keyboardShortcut: "Shift",
    shortcutName: "Corner Markup",
    tooltipText: <ShiftTooltipText />,
    value: "corner-markup",
  },
  {
    keyboardShortcut: "Alt",
    shortcutName: "Color Markup",
    tooltipText: <AltTooltipText />,
    value: "color-markup",
  },
  {
    keyboardShortcut: "M",
    shortcutName: "Multiselect Toggle",
    tooltipText: <MultiselectTooltipText />,
    value: "multiselect-toggle",
  },
];

const ShortcutsMenu = () => (
  <Menu.Root>
    <Menu.Trigger
      asChild
      alignSelf="center"
      color="white"
      cursor="pointer"
      hideBelow="sm"
    >
      <Button unstyled>
        <ImKeyboard />
      </Button>
    </Menu.Trigger>
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          {nonClearCellShortcutItems.map(
            ({ keyboardShortcut, shortcutName, tooltipText, value }) => (
              <Tooltip content={tooltipText} key={value}>
                <Menu.Item value={value}>
                  <Box flex="1">{shortcutName}</Box>
                  <Menu.ItemCommand>
                    <Kbd>{keyboardShortcut}</Kbd>
                  </Menu.ItemCommand>
                </Menu.Item>
              </Tooltip>
            ),
          )}
          <Menu.Item backgroundColor="transparent" value="clear-cell">
            <Box flex="1" alignSelf="flex-start">
              Clear Cell
            </Box>
            <Menu.ItemCommand>
              <VStack>
                <Kbd>Backspace</Kbd>
                <Kbd>Delete</Kbd>
                <Kbd>Escape</Kbd>
              </VStack>
            </Menu.ItemCommand>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  </Menu.Root>
);
// #endregion

// #region Settings Menu

// #region Settings Checkbox
type SettingCheckboxProps = {
  settingKey: keyof UserSettings;
  settingLabel: string;
  userSettings: UserSettings;
  onCheckedChange: (checked: boolean) => void;
};

const SettingsCheckbox = ({
  settingKey,
  settingLabel,
  userSettings,
  onCheckedChange,
}: SettingCheckboxProps) => (
  <Menu.CheckboxItem
    checked={userSettings[settingKey]}
    closeOnSelect={false}
    key={settingKey}
    value={settingKey}
    onCheckedChange={onCheckedChange}
  >
    {settingLabel}
    <Menu.ItemIndicator />
  </Menu.CheckboxItem>
);
// #endregion

const SettingsMenu = () => {
  const { pauseStopwatch, startStopwatch } = useSudokuStopwatch();
  const { userSettings, setUserSettings } = useUserSettings();

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton alignSelf="center" color="white" cursor="pointer" unstyled>
          <MdOutlineSettings />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Gameplay</Menu.ItemGroupLabel>
              <SettingsCheckbox
                settingKey="conflictChecker"
                settingLabel="Conflict Checker"
                userSettings={userSettings}
                onCheckedChange={() =>
                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    conflictChecker: !previousUserSettings.conflictChecker,
                  }))
                }
              />

              <SettingsCheckbox
                settingKey="showSeenCells"
                settingLabel="Show Seen Cells"
                userSettings={userSettings}
                onCheckedChange={() =>
                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    showSeenCells: !previousUserSettings.showSeenCells,
                  }))
                }
              />

              <SettingsCheckbox
                settingKey="strictHighlights"
                settingLabel="Strict Highlights"
                userSettings={userSettings}
                onCheckedChange={() =>
                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    strictHighlights: !previousUserSettings.strictHighlights,
                  }))
                }
              />
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Visual</Menu.ItemGroupLabel>
              <SettingsCheckbox
                settingKey="flipKeypad"
                settingLabel="Flip Keypad"
                userSettings={userSettings}
                onCheckedChange={() =>
                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    flipKeypad: !previousUserSettings.flipKeypad,
                  }))
                }
              />

              <SettingsCheckbox
                settingKey="dashedGrid"
                settingLabel="Dashed Grid"
                userSettings={userSettings}
                onCheckedChange={() =>
                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    dashedGrid: !previousUserSettings.dashedGrid,
                  }))
                }
              />

              <SettingsCheckbox
                settingKey="disableStopwatch"
                settingLabel="Disable Stopwatch"
                userSettings={userSettings}
                onCheckedChange={() => {
                  if (!userSettings.disableStopwatch) pauseStopwatch();
                  else startStopwatch();

                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    disableStopwatch: !previousUserSettings.disableStopwatch,
                  }));
                }}
              />

              <Tooltip
                content="Unless disabled, the stopwatch continues to run and appears on the end screen as your final time."
                key="hideStopwatch"
              >
                <Menu.CheckboxItem
                  checked={userSettings.hideStopwatch}
                  closeOnSelect={false}
                  value={"hideStopwatch"}
                  onCheckedChange={() => {
                    setUserSettings((previousUserSettings) => ({
                      ...previousUserSettings,
                      hideStopwatch: !previousUserSettings.hideStopwatch,
                    }));
                  }}
                >
                  Hide Stopwatch
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              </Tooltip>

              <SettingsCheckbox
                settingKey="showRowAndColumnLabels"
                settingLabel="Show Row + Column Labels"
                userSettings={userSettings}
                onCheckedChange={() =>
                  setUserSettings((previousUserSettings) => ({
                    ...previousUserSettings,
                    showRowAndColumnLabels:
                      !previousUserSettings.showRowAndColumnLabels,
                  }))
                }
              />
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
// #endregion

export const Header = () => {
  const { userSettings } = useUserSettings();
  return (
    <Flex
      align="start"
      as="header"
      backgroundColor="gray.fg"
      height="12"
      justifyContent={userSettings.hideStopwatch ? "end" : "space-between"}
      padding="0.625rem 1rem"
      width="full"
    >
      <Stopwatch />
      <Group alignSelf="center">
        <ShortcutsMenu />
        <SettingsMenu />
      </Group>
    </Flex>
  );
};
