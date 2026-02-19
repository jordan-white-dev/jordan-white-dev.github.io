import { Icon, RadioCard, SimpleGrid } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { CenterSVG, ColorSVG, CornerSVG, DigitSVG } from "./svgs";
import { Tooltip } from "./tooltip";

type InputModeItemProps = {
  ariaLabel: string;
  icon: ReactNode;
  inputModeValue: string;
  tooltipText: string;
};

export const InputModeItem = ({
  ariaLabel,
  icon,
  inputModeValue,
  tooltipText,
  ...props
}: InputModeItemProps) => {
  return (
    <RadioCard.Item
      alignItems="center"
      aria-label={ariaLabel}
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

export const InputModes = () => (
  <RadioCard.Root
    align="center"
    colorPalette="yellow"
    defaultValue="digit"
    variant="solid"
  >
    <SimpleGrid
      columns={{ base: 1, lg: 2 }}
      gap={{ base: "0.229rem", sm: "1", md: "0.5833rem", lg: "3" }}
      minWidth={{ lg: "12.75rem" }}
    >
      <InputModeItem
        ariaLabel="Digit"
        icon={<DigitSVG />}
        inputModeValue="digit"
        tooltipText="Digit input mode"
      />
      <InputModeItem
        ariaLabel="Color"
        icon={<ColorSVG />}
        inputModeValue="color"
        tooltipText="Color markup mode"
      />
      <InputModeItem
        ariaLabel="Center"
        icon={<CenterSVG />}
        inputModeValue="center"
        tooltipText="Center markup mode"
      />
      <InputModeItem
        ariaLabel="Corner"
        icon={<CornerSVG />}
        inputModeValue="corner"
        tooltipText="Corner markup mode"
      />
    </SimpleGrid>
  </RadioCard.Root>
);
