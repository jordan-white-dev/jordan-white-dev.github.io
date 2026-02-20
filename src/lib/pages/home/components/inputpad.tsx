import {
  ColorSwatch,
  GridItem,
  Icon,
  IconButton,
  type IconButtonProps,
  type IconProps,
  SimpleGrid,
  Square,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import { FiDelete } from "react-icons/fi";
import { GrCheckbox, GrMultiple } from "react-icons/gr";

import type { InputMode } from "..";
import { Tooltip } from "./tooltip";

const COLOR_SWATCH_SIZE: IconProps["width"] = {
  base: "2.105rem",
  sm: "11",
  md: "16",
};
const ICON_SIZE: IconProps["width"] = { base: "6", sm: "8", md: "11" };
const ICON_BUTTON_SIZE: IconButtonProps["size"] = {
  base: "xs",
  sm: "lg",
  md: "2xl",
};
const ICON_BUTTON_TEXT_STYLE: IconButtonProps["textStyle"] = {
  base: "md",
  sm: "3xl",
  md: "5xl",
};

type ColorInputsProps = {
  buttonColor: string;
};

const ColorInput = ({ buttonColor }: ColorInputsProps) => {
  return (
    <GridItem colSpan={2} height={COLOR_SWATCH_SIZE} width={COLOR_SWATCH_SIZE}>
      <ColorSwatch
        height={COLOR_SWATCH_SIZE}
        rounded="md"
        value={buttonColor}
        width={COLOR_SWATCH_SIZE}
      />
    </GridItem>
  );
};

const ColorPadInputs = () => (
  <>
    <ColorInput buttonColor="#666666" />
    <ColorInput buttonColor="#b0b0b0" />
    <ColorInput buttonColor="#ffffff" />
    <ColorInput buttonColor="#f690f6" />
    <ColorInput buttonColor="#f98987" />
    <ColorInput buttonColor="#c69c78" />
    <ColorInput buttonColor="#efc084" />
    <ColorInput buttonColor="#ffff75" />
    <ColorInput buttonColor="#d1efa6" />
  </>
);

type NumberInputProps = {
  buttonValue: string;
};

const NumberInput = ({ buttonValue }: NumberInputProps) => {
  return (
    <GridItem colSpan={2}>
      <Square aspectRatio="square">
        <IconButton
          aspectRatio="square"
          color="white"
          colorPalette="blue"
          rounded="md"
          size={ICON_BUTTON_SIZE}
          textStyle={ICON_BUTTON_TEXT_STYLE}
        >
          {buttonValue}
        </IconButton>
      </Square>
    </GridItem>
  );
};

const NumberPadInputs = () => (
  <>
    <NumberInput buttonValue="1" />
    <NumberInput buttonValue="2" />
    <NumberInput buttonValue="3" />
    <NumberInput buttonValue="4" />
    <NumberInput buttonValue="5" />
    <NumberInput buttonValue="6" />
    <NumberInput buttonValue="7" />
    <NumberInput buttonValue="8" />
    <NumberInput buttonValue="9" />
  </>
);

type MultiselectSwitchProps = {
  isMultiselectMode: boolean;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
};

const MultiselectSwitch = ({
  isMultiselectMode,
  setIsMultiselectMode,
}: MultiselectSwitchProps) => (
  <GridItem
    alignContent="center"
    border={{ sm: "2px solid" }}
    borderColor={{ sm: "blue.border" }}
    colSpan={3}
    height="full"
    rounded="md"
    width="full"
  >
    <Tooltip content="Multiple cells can be selected while this is toggled">
      <Stack alignItems="center" direction="column" gap="1">
        <Switch.Root
          checked={isMultiselectMode}
          colorPalette="blue"
          size="lg"
          onCheckedChange={(e) => setIsMultiselectMode(e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
            <Switch.Indicator fallback={<Icon as={GrCheckbox} />}>
              <Icon as={GrMultiple} />
            </Switch.Indicator>
          </Switch.Control>
        </Switch.Root>
        <Text
          alignSelf="center"
          fontWeight="semibold"
          hideBelow="md"
          justifySelf="center"
        >
          Multiselect
        </Text>
      </Stack>
    </Tooltip>
  </GridItem>
);

const DeleteButton = () => (
  <GridItem colSpan={3}>
    <Tooltip
      content="Delete content from the selected cells"
      positioning={{ placement: "bottom" }}
    >
      <IconButton
        aria-label="Delete"
        color="white"
        colorPalette="blue"
        rounded="md"
        size={ICON_BUTTON_SIZE}
        textStyle={ICON_BUTTON_TEXT_STYLE}
        width="full"
      >
        <Icon height={ICON_SIZE} width={ICON_SIZE}>
          <FiDelete />
        </Icon>
      </IconButton>
    </Tooltip>
  </GridItem>
);

type InputPadProps = {
  inputMode: InputMode;
  isMultiselectMode: boolean;
  setIsMultiselectMode: Dispatch<SetStateAction<boolean>>;
};

export const InputPad = ({
  inputMode,
  isMultiselectMode,
  setIsMultiselectMode,
}: InputPadProps) => {
  return (
    <SimpleGrid
      columns={6}
      gap={{ base: "0.1874rem", sm: "1", md: "1.5" }}
      height="fit-content"
    >
      {inputMode === "Color" ? <ColorPadInputs /> : <NumberPadInputs />}

      <MultiselectSwitch
        isMultiselectMode={isMultiselectMode}
        setIsMultiselectMode={setIsMultiselectMode}
      />
      <DeleteButton />
    </SimpleGrid>
  );
};
