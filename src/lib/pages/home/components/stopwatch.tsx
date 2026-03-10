import {
  Button,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Portal,
  Text,
} from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { ImStopwatch } from "react-icons/im";
import { MdOutlinePauseCircle, MdOutlinePlayCircle } from "react-icons/md";

import { useUserSettings } from "..";

// #region Stopwatch Commands Context
type StopwatchCommands = {
  pause: () => void;
  reset: () => void;
  start: () => void;
};

const StopwatchCommandsContext = createContext<StopwatchCommands | undefined>(
  undefined,
);

export const useStopwatchCommands = () => {
  const context = useContext(StopwatchCommandsContext);
  if (!context)
    throw Error(
      "useStopwatchCommands must be used within StopwatchCommandsProvider",
    );

  return context;
};

export const StopwatchCommandsProvider = StopwatchCommandsContext.Provider;
// #endregion

// #region Stopwatch Time Context
type StopwatchTime = {
  isRunning: boolean;
  stopwatchTime: string;
};

export const StopwatchTimeContext = createContext<StopwatchTime | undefined>(
  undefined,
);

export const useStopwatchTime = () => {
  const context = useContext(StopwatchTimeContext);
  if (!context)
    throw Error("useStopwatchTime must be used within StopwatchTimeProvider");

  return context;
};

export const StopwatchTimeProvider = StopwatchTimeContext.Provider;
// #endregion

const StopwatchDialogTrigger = () => {
  const { pause } = useStopwatchCommands();
  const { isRunning, stopwatchTime } = useStopwatchTime();

  return (
    <Dialog.Trigger asChild>
      <HStack cursor="pointer">
        <Text
          color="white"
          fontFamily="sans-serif"
          fontWeight="medium"
          textStyle="lg"
          onClick={pause}
        >
          {stopwatchTime}
        </Text>
        <IconButton
          alignSelf="center"
          color="white"
          cursor="pointer"
          onClick={pause}
          unstyled
        >
          {isRunning ? <MdOutlinePauseCircle /> : <MdOutlinePlayCircle />}
        </IconButton>
      </HStack>
    </Dialog.Trigger>
  );
};

const StopwatchDialogFooter = () => {
  const { pause, start } = useStopwatchCommands();
  const { setUserSettings } = useUserSettings();

  return (
    <Dialog.Footer justifyContent="center">
      <Dialog.ActionTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            start();
            setUserSettings((previousUserSettings) => {
              return {
                ...previousUserSettings,
                disableStopwatch: false,
              };
            });
          }}
        >
          Resume <MdOutlinePlayCircle />
        </Button>
      </Dialog.ActionTrigger>

      <Dialog.ActionTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            pause();
            setUserSettings((previousUserSettings) => {
              return {
                ...previousUserSettings,
                disableStopwatch: true,
              };
            });
          }}
        >
          Stay Paused <MdOutlinePauseCircle />
        </Button>
      </Dialog.ActionTrigger>
    </Dialog.Footer>
  );
};

const startStopwatchIfEnabled = (
  disableStopwatchSetting: boolean,
  start: () => void,
) => {
  if (!disableStopwatchSetting) start();
};

export const Stopwatch = () => {
  const { start } = useStopwatchCommands();
  const { userSettings } = useUserSettings();

  return (
    <Flex gap="1.5" textAlign="center">
      <Dialog.Root
        placement="center"
        size="xs"
        motionPreset="slide-in-bottom"
        onEscapeKeyDown={() =>
          startStopwatchIfEnabled(userSettings.disableStopwatch, start)
        }
        onPointerDownOutside={() =>
          startStopwatchIfEnabled(userSettings.disableStopwatch, start)
        }
      >
        <StopwatchDialogTrigger />

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header justifyContent="center">
                <Dialog.Title>
                  <HStack>
                    <ImStopwatch />
                    <Text>Game Paused</Text>
                    <ImStopwatch />
                  </HStack>
                </Dialog.Title>
              </Dialog.Header>

              <StopwatchDialogFooter />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
