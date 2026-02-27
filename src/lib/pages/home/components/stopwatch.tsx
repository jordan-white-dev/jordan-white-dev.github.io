import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  IconButton,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdOutlinePauseCircle, MdOutlinePlayCircle } from "react-icons/md";
import { useStopwatch } from "react-timer-hook";

export const Stopwatch = () => {
  const [isPaused, setIsPaused] = useState(false);
  const { seconds, minutes, pause, start } = useStopwatch();

  const handleClick = () => {
    if (isPaused) start();
    else pause();

    setIsPaused((isPaused) => !isPaused);
  };

  const paddedSeconds =
    seconds.toString().length === 1
      ? `0${seconds.toString()}`
      : seconds.toString();

  const paddedMinutes =
    minutes.toString().length === 1
      ? `0${minutes.toString()}`
      : minutes.toString();

  return (
    <Flex gap="1.5" textAlign="center">
      <Text
        color="white"
        fontFamily="sans-serif"
        fontWeight="medium"
        textStyle="lg"
      >
        {paddedMinutes}:{paddedSeconds}
      </Text>

      <Dialog.Root placement="center" size="lg" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
          <IconButton
            alignSelf="center"
            color="white"
            onClick={() => handleClick()}
            unstyled
          >
            {isPaused ? <MdOutlinePlayCircle /> : <MdOutlinePauseCircle />}
          </IconButton>
        </Dialog.Trigger>

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog Title</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>

                <Button>Save</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};
