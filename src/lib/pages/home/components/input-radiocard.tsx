import { Icon, RadioCard, SimpleGrid } from "@chakra-ui/react";

import { CenterSVG, ColorSVG, CornerSVG, DigitSVG } from "./svgs";
import { Tooltip } from "./tooltip";

const inputs = [
  { value: "digit", label: "Digit", icon: <DigitSVG /> },
  { value: "color", label: "Color", icon: <ColorSVG /> },
  { value: "corner", label: "Corner", icon: <CornerSVG /> },
  { value: "center", label: "Center", icon: <CenterSVG /> },
];

export const InputRadioCard = () => (
  <RadioCard.Root
    align="center"
    colorPalette="orange"
    defaultValue="digit"
    variant="solid"
  >
    <SimpleGrid
      columns={{ base: 1, lg: 2 }}
      gap={{ base: "0.5", sm: "1", md: "0.5833rem", lg: "3" }}
      minWidth={{ lg: "12.75rem" }}
    >
      {inputs.map((input) => (
        <RadioCard.Item
          alignItems="center"
          aria-label={input.label}
          key={input.value}
          padding="0"
          value={input.value}
        >
          <RadioCard.ItemHiddenInput />
          <Tooltip
            content={input.label}
            positioning={{ placement: "right-start" }}
          >
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
                {input.icon}
              </Icon>
            </RadioCard.ItemControl>
          </Tooltip>
        </RadioCard.Item>
      ))}
    </SimpleGrid>
  </RadioCard.Root>
);
