import {
  Button,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Portal,
  Text,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { ImStopwatch } from "react-icons/im";
import { MdOutlinePauseCircle, MdOutlinePlayCircle } from "react-icons/md";

type StopwatchProps = {
  isRunning: boolean;
  isStayPausedMode: boolean;
  stopwatchTime: string;
  pause: () => void;
  setIsStayPausedMode: Dispatch<SetStateAction<boolean>>;
  start: () => void;
};

export const Stopwatch = ({
  isRunning,
  isStayPausedMode,
  stopwatchTime,
  pause,
  setIsStayPausedMode,
  start,
}: StopwatchProps) => (
  <Flex gap="1.5" textAlign="center">
    <Dialog.Root
      placement="center"
      size="xs"
      motionPreset="slide-in-bottom"
      onEscapeKeyDown={() => {
        if (!isStayPausedMode) start();
      }}
      onPointerDownOutside={() => {
        if (!isStayPausedMode) start();
      }}
    >
      <Dialog.Trigger asChild>
        <HStack>
          <Text
            color="white"
            cursor="pointer"
            fontFamily="sans-serif"
            fontWeight="medium"
            textStyle="lg"
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
                  onClick={() => {
                    setIsStayPausedMode(false);
                    start();
                  }}
                >
                  Resume <MdOutlinePlayCircle />
                </Button>
              </Dialog.ActionTrigger>

              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsStayPausedMode(true);
                    pause();
                  }}
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
