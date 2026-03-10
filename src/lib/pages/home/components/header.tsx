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
import type { Dispatch, SetStateAction } from "react";
import { ImKeyboard } from "react-icons/im";
import { MdOutlineSettings } from "react-icons/md";

import { type UserSettings, useUserSettings } from "..";
import { Stopwatch } from "./stopwatch";

// #region Shortcuts Menu
const nonClearCellShortcutItems = [
  {
    keyboardShortcut: "Ctrl",
    shortcutName: "Center Markup",
    value: "center-markup",
  },
  {
    keyboardShortcut: "Shift",
    shortcutName: "Corner Markup",
    value: "corner-markup",
  },
  {
    keyboardShortcut: "Alt",
    shortcutName: "Color Markup",
    value: "color-markup",
  },
  {
    keyboardShortcut: "M",
    shortcutName: "Multiselect Toggle",
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
            ({ keyboardShortcut, shortcutName, value }) => (
              <Menu.Item
                backgroundColor="transparent"
                key={value}
                value={value}
              >
                <Box flex="1">{shortcutName}</Box>
                <Menu.ItemCommand>
                  <Kbd>{keyboardShortcut}</Kbd>
                </Menu.ItemCommand>
              </Menu.Item>
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
  disabled: boolean;
  settingKey: keyof UserSettings;
  settingLabel: string;
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
};

const SettingsCheckbox = ({
  disabled,
  settingKey,
  settingLabel,
  userSettings,
  setUserSettings,
}: SettingCheckboxProps) => (
  <Menu.CheckboxItem
    checked={userSettings[settingKey]}
    closeOnSelect={false}
    disabled={disabled}
    key={settingKey}
    value={settingKey}
    onCheckedChange={() =>
      setUserSettings((previousUserSettings) => ({
        ...previousUserSettings,
        [settingKey]: !previousUserSettings[settingKey],
      }))
    }
  >
    {settingLabel}
    <Menu.ItemIndicator />
  </Menu.CheckboxItem>
);
// #endregion

const SettingsMenu = () => {
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
                disabled={true}
                settingKey="conflictChecker"
                settingLabel="Conflict Checker"
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />

              <SettingsCheckbox
                disabled={true}
                settingKey="showSeenCells"
                settingLabel="Show Seen Cells"
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Visual</Menu.ItemGroupLabel>
              <SettingsCheckbox
                disabled={false}
                settingKey="flipKeypad"
                settingLabel="Flip Keypad"
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />

              <SettingsCheckbox
                disabled={false}
                settingKey="dashedGrid"
                settingLabel="Dashed Grid"
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />

              <SettingsCheckbox
                disabled={true}
                settingKey="disableStopwatch"
                settingLabel="Disable Stopwatch"
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />

              <SettingsCheckbox
                disabled={true}
                settingKey="showRowAndColumnLabels"
                settingLabel="Show Row + Column Labels"
                userSettings={userSettings}
                setUserSettings={setUserSettings}
              />
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
// #endregion

type HeaderProps = {
  isStayPausedMode: boolean;
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
};

export const Header = ({
  isStayPausedMode,
  setIsStayPausedMode,
}: HeaderProps) => (
  <Flex
    align="start"
    as="header"
    backgroundColor="gray.fg"
    height="fit-content"
    justifyContent="space-between"
    padding="0.625rem 1rem"
    width="full"
  >
    <Stopwatch
      isStayPausedMode={isStayPausedMode}
      setIsStayPausedMode={setIsStayPausedMode}
    />
    <Group alignSelf="center">
      <ShortcutsMenu />
      <SettingsMenu />
    </Group>
  </Flex>
);
