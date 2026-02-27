import { Flex, IconButton, Text } from "@chakra-ui/react";
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

      <IconButton
        alignSelf="center"
        color="white"
        onClick={() => handleClick()}
        unstyled
      >
        {isPaused ? <MdOutlinePlayCircle /> : <MdOutlinePauseCircle />}
      </IconButton>
    </Flex>
  );
};
