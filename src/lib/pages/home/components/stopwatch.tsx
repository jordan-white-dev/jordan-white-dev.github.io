import {
  Button,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Portal,
  Text,
} from "@chakra-ui/react";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
} from "react";
import { ImStopwatch } from "react-icons/im";
import { MdOutlinePauseCircle, MdOutlinePlayCircle } from "react-icons/md";

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
    throw new Error(
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
    throw new Error(
      "useStopwatchTime must be used within StopwatchTimeProvider",
    );

  return context;
};

export const StopwatchTimeProvider = StopwatchTimeContext.Provider;
// #endregion

const startTimerIfNotInStayPausedMode = (
  isStayPausedMode: boolean,
  start: () => void,
) => {
  if (!isStayPausedMode) start();
};

const startTimerAndHandleStayPausedMode = (
  start: () => void,
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>,
) => {
  start();
  setIsStayPausedMode(false);
};

const pauseTimerAndHandleStayPausedMode = (
  pause: () => void,
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>,
) => {
  pause();
  setIsStayPausedMode(true);
};

type StopwatchProps = {
  isStayPausedMode: boolean;
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
};

export const Stopwatch = ({
  isStayPausedMode,
  setIsStayPausedMode,
}: StopwatchProps) => {
  const { pause, start } = useStopwatchCommands();
  const { isRunning, stopwatchTime } = useStopwatchTime();

  return (
    <Flex gap="1.5" textAlign="center">
      <Dialog.Root
        placement="center"
        size="xs"
        motionPreset="slide-in-bottom"
        onEscapeKeyDown={() =>
          startTimerIfNotInStayPausedMode(isStayPausedMode, start)
        }
        onPointerDownOutside={() =>
          startTimerIfNotInStayPausedMode(isStayPausedMode, start)
        }
      >
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

              <Dialog.Footer justifyContent="center">
                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() =>
                      startTimerAndHandleStayPausedMode(
                        start,
                        setIsStayPausedMode,
                      )
                    }
                  >
                    Resume <MdOutlinePlayCircle />
                  </Button>
                </Dialog.ActionTrigger>

                <Dialog.ActionTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() =>
                      pauseTimerAndHandleStayPausedMode(
                        pause,
                        setIsStayPausedMode,
                      )
                    }
                  >
                    Stay Paused <MdOutlinePauseCircle />
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
