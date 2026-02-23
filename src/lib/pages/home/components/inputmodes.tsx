import { Icon, RadioCard, SimpleGrid } from "@chakra-ui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { InputMode } from "..";
import { CenterSVG, ColorSVG, CornerSVG, DigitSVG } from "./svgs";
import { Tooltip } from "./tooltip";

// #region Input Mode Radio Card Item
type InputModeRadioCardItemProps = {
  icon: ReactNode;
  inputModeValue: InputMode;
  tooltipText: string;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
};

export const InputModeRadioCardItem = ({
  icon,
  inputModeValue,
  tooltipText,
  setInputMode,
  ...props
}: InputModeRadioCardItemProps) => {
  return (
    <RadioCard.Item
      alignItems="center"
      aria-label={tooltipText}
      padding="0"
      value={inputModeValue}
      {...props}
    >
      <RadioCard.ItemHiddenInput />
      <Tooltip content={tooltipText} positioning={{ placement: "right-start" }}>
        <RadioCard.ItemControl padding="0">
          <Icon
            boxSize={{
              base: "1.922rem",
              sm: "2.625rem",
              md: "3.72rem",
              lg: 20,
            }}
            fill="black"
          >
            {icon}
          </Icon>
        </RadioCard.ItemControl>
      </Tooltip>
    </RadioCard.Item>
  );
};
// #endregion

type InputModeRadioCardProps = {
  inputMode: InputMode;
  setInputMode: Dispatch<SetStateAction<InputMode>>;
};

export const InputModeRadioCard = ({
  inputMode,
  setInputMode,
}: InputModeRadioCardProps) => {
  return (
    <RadioCard.Root
      align="center"
      colorPalette="yellow"
      defaultValue="digit"
      value={inputMode}
      variant="solid"
      onValueChange={(e) => setInputMode(e.value as InputMode)}
    >
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        gap={{ base: "0.229rem", sm: "1", md: "0.5833rem", lg: "3" }}
        minWidth={{ lg: "12.75rem" }}
      >
        <InputModeRadioCardItem
          icon={<DigitSVG />}
          inputModeValue="Digit"
          tooltipText="Digit input mode"
          setInputMode={setInputMode}
        />
        <InputModeRadioCardItem
          icon={<ColorSVG />}
          inputModeValue="Color"
          tooltipText="Color markup mode"
          setInputMode={setInputMode}
        />
        <InputModeRadioCardItem
          icon={<CenterSVG />}
          inputModeValue="Center"
          tooltipText="Center markup mode"
          setInputMode={setInputMode}
        />
        <InputModeRadioCardItem
          icon={<CornerSVG />}
          inputModeValue="Corner"
          tooltipText="Corner markup mode"
          setInputMode={setInputMode}
        />
      </SimpleGrid>
    </RadioCard.Root>
  );
};
