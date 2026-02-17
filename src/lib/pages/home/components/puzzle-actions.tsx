import {
  Button,
  GridItem,
  Icon,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { GrMultiple } from "react-icons/gr";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";

import { Tooltip } from "./tooltip";

const actions = [
  { value: "new-puzzle", label: "New Puzzle", text: "New Puzzle" },
  { value: "undo", label: "Undo", icon: <ImUndo /> },
  { value: "redo", label: "Redo", icon: <ImRedo /> },
  { value: "submit", label: "Submit", icon: <ImCheckmark /> },
  { value: "multiselect", label: "Multiselect", icon: <GrMultiple /> },
];

export const PuzzleActions = (
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
            rounded={{ base: "sm", sm: "md" }}
            size={{ sm: "xs", md: "lg", lg: "xl" }}
            padding={{ base: "0.25rem 0 0.25rem 0" }}
            width="full"
          >
            <Icon
              height={{ base: "4", sm: "4.5", md: "6", lg: "7" }}
              width={{ base: "4", sm: "4.5", md: "6", lg: "7" }}
            >
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
              rounded={{ base: "sm", sm: "md" }}
              size={{ sm: "xs", md: "lg", lg: "xl" }}
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
