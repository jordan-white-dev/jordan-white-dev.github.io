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

type StopwatchDialogFooterProps = {
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
};

const StopwatchDialogFooter = ({
  setIsStayPausedMode,
}: StopwatchDialogFooterProps) => {
  const { pause, start } = useStopwatchCommands();

  return (
    <Dialog.Footer justifyContent="center">
      <Dialog.ActionTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            start();
            setIsStayPausedMode(false);
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
            setIsStayPausedMode(true);
          }}
        >
          Stay Paused <MdOutlinePauseCircle />
        </Button>
      </Dialog.ActionTrigger>
    </Dialog.Footer>
  );
};

const startStopwatchIfNotInStayPausedMode = (
  isStayPausedMode: boolean,
  start: () => void,
) => {
  if (!isStayPausedMode) start();
};

type StopwatchProps = {
  isStayPausedMode: boolean;
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
};

export const Stopwatch = ({
  isStayPausedMode,
  setIsStayPausedMode,
}: StopwatchProps) => {
  const { start } = useStopwatchCommands();

  return (
    <Flex gap="1.5" textAlign="center">
      <Dialog.Root
        placement="center"
        size="xs"
        motionPreset="slide-in-bottom"
        onEscapeKeyDown={() =>
          startStopwatchIfNotInStayPausedMode(isStayPausedMode, start)
        }
        onPointerDownOutside={() =>
          startStopwatchIfNotInStayPausedMode(isStayPausedMode, start)
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

              <StopwatchDialogFooter
                setIsStayPausedMode={setIsStayPausedMode}
              />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
