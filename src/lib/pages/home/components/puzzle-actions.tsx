import {
  Button,
  type ButtonProps,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
} from "@chakra-ui/react";
import { GrMultiple } from "react-icons/gr";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";

import { Tooltip } from "./tooltip";

const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
  sm: "xs",
  md: "lg",
  lg: "xl",
};
const ICON_SIZE: IconProps["width"] = {
  base: "4",
  sm: "4.5",
  md: "6",
  lg: "7",
};
const BUTTON_ROUNDED: ButtonProps["rounded"] = {
  base: "sm",
  sm: "md",
};

const actions = [
  { value: "new-puzzle", label: "New Puzzle", text: "New Puzzle" },
  { value: "undo", label: "Undo", icon: <ImUndo /> },
  { value: "redo", label: "Redo", icon: <ImRedo /> },
  { value: "submit", label: "Submit", icon: <ImCheckmark /> },
  { value: "multiselect", label: "Multiselect", icon: <GrMultiple /> },
];

export const PuzzleActions = () => (
  <SimpleGrid
    columns={{ base: 1, lg: 2 }}
    columnGap={{ base: "0.5", sm: "1", lg: "3" }}
    rowGap={{ base: "0.5", sm: "1" }}
  >
    {actions.map((action) =>
      action.icon ? (
        <Tooltip
          key={`${action.value}-tooltip`}
          content={action.label}
          positioning={{ placement: "left-start" }}
        >
          <IconButton
            aria-label={action.label}
            aspectRatio={{ lg: 2 / 1 }}
            key={action.value}
            rounded={BUTTON_ROUNDED}
            size={ICON_BUTTON_SIZE}
            padding={{ base: "0.25rem 0 0.25rem 0" }}
            width="full"
          >
            <Icon height={ICON_SIZE} width={ICON_SIZE}>
              {action.icon}
            </Icon>
          </IconButton>
        </Tooltip>
      ) : (
        action.text && (
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Button
              aria-label={action.label}
              fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
              key={action.value}
              rounded={BUTTON_ROUNDED}
              size={ICON_BUTTON_SIZE}
              padding={{ base: "1" }}
              width="full"
            >
              {action.text}
            </Button>
          </GridItem>
        )
      ),
    )}
  </SimpleGrid>
);
