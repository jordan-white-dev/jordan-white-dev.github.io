import {
  Box,
  Button,
  Flex,
  Group,
  IconButton,
  Kbd,
  Menu,
  Portal,
  useCheckboxGroup,
  VStack,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { ImKeyboard } from "react-icons/im";
import { MdOutlineSettings } from "react-icons/md";

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
const gameplayCheckboxItems = [
  { settingName: "Conflict Checker", value: "conflict-checker" },
  { settingName: "Show Seen Cells", value: "show-seen-cells" },
];

const visualCheckboxItems = [
  { settingName: "Flip Keypad", value: "flip-keypad" },
  { settingName: "Disable Stopwatch", value: "disable-stopwatch" },
  { settingName: "Dashed Grid", value: "dashed-grid" },
  { settingName: "Show Row/Column Labels", value: "show-row-column-labels" },
];

const SettingsMenu = () => {
  const checkboxGroup = useCheckboxGroup();
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          alignSelf="center"
          color="white"
          cursor="pointer"
          onClick={() => {
            return;
          }}
          unstyled
        >
          <MdOutlineSettings />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Gameplay</Menu.ItemGroupLabel>
              {gameplayCheckboxItems.map(({ settingName, value }) => (
                <Menu.CheckboxItem
                  checked={checkboxGroup.isChecked(value)}
                  closeOnSelect={false}
                  disabled={true}
                  key={value}
                  value={value}
                  onCheckedChange={() => checkboxGroup.toggleValue(value)}
                >
                  {settingName}
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              ))}
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Visual</Menu.ItemGroupLabel>
              {visualCheckboxItems.map(({ settingName, value }) => (
                <Menu.CheckboxItem
                  checked={checkboxGroup.isChecked(value)}
                  closeOnSelect={false}
                  disabled={true}
                  key={value}
                  value={value}
                  onCheckedChange={() => checkboxGroup.toggleValue(value)}
                >
                  {settingName}
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              ))}
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
    <Group>
      <ShortcutsMenu />
      <SettingsMenu />
    </Group>
  </Flex>
);
