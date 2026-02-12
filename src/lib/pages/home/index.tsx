import {
  Button,
  chakra,
  Flex,
  GridItem,
  type HTMLChakraProps,
  Icon,
  IconButton,
  RadioCard,
  SimpleGrid,
  Square,
  Stack,
} from "@chakra-ui/react";
import { FiDelete } from "react-icons/fi";
import { GrMultiple } from "react-icons/gr";
import { ImCheckmark, ImRedo, ImUndo } from "react-icons/im";

const SudokuCell = (cellValue: string) => {
  return (
    <Square
      aspectRatio="square"
      border="1px solid black"
      minHeight={{ base: "31px", sm: "51px", md: "80px" }}
      minWidth={{ base: "31px", sm: "51px", md: "80px" }}
    >
      <Button
        backgroundColor="transparent"
        borderRadius="0"
        borderWidth="0"
        color="black"
        height={{ base: "31px", sm: "51px", md: "80px" }}
        padding="0"
        textStyle={{
          base: "2xl",
          sm: "4xl",
          md: "6xl",
        }}
        width={{ base: "31px", sm: "51px", md: "80px" }}
      >
        {cellValue}
      </Button>
    </Square>
  );
};

const SudokuBox = (
  <SimpleGrid
    border="2px solid black"
    columns={3}
    gap="0"
    height={{ base: "103px", sm: "157px", md: "244px" }}
    width={{ base: "103px", sm: "157px", md: "244px" }}
  >
    {SudokuCell("1")}
    {SudokuCell("2")}
    {SudokuCell("3")}
    {SudokuCell("4")}
    {SudokuCell("5")}
    {SudokuCell("6")}
    {SudokuCell("7")}
    {SudokuCell("8")}
    {SudokuCell("9")}
  </SimpleGrid>
);

const SudokuGrid = (
  <SimpleGrid
    border="2px solid black"
    columns={3}
    gap="0"
    minHeight={{ base: "313px", sm: "475px", md: "736px" }}
    minWidth={{ base: "313px", sm: "475px", md: "736px" }}
  >
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
    {SudokuBox}
  </SimpleGrid>
);

const NumpadButton = (buttonValue: string) => {
  return (
    <Square aspectRatio="square">
      <IconButton
        aspectRatio="square"
        backgroundColor="blue.fg"
        color="white"
        rounded="md"
        size={{ base: "xs", sm: "lg", md: "2xl" }}
        textStyle={{ base: "md", sm: "3xl", md: "5xl" }}
      >
        {buttonValue}
      </IconButton>
    </Square>
  );
};

const NumberPad = (
  <SimpleGrid
    height="fit-content"
    columns={3}
    gap={{ base: "0.1875rem", sm: "1", md: "1.5" }}
  >
    {NumpadButton("1")}
    {NumpadButton("2")}
    {NumpadButton("3")}
    {NumpadButton("4")}
    {NumpadButton("5")}
    {NumpadButton("6")}
    {NumpadButton("7")}
    {NumpadButton("8")}
    {NumpadButton("9")}
    <GridItem colSpan={3}>
      <IconButton
        aria-label="Delete"
        backgroundColor="blue.fg"
        color="white"
        rounded="md"
        size={{ base: "xs", sm: "lg", md: "2xl" }}
        textStyle={{ base: "md", sm: "3xl", md: "5xl" }}
        width="full"
      >
        <Icon size="2xl">
          <FiDelete />
        </Icon>
      </IconButton>
    </GridItem>
  </SimpleGrid>
);

const actions = [
  { value: "undo", label: "Undo", icon: <ImUndo /> },
  { value: "redo", label: "Redo", icon: <ImRedo /> },
  { value: "Submit", label: "Submit", icon: <ImCheckmark /> },
  { value: "multiselect", label: "Multiselect", icon: <GrMultiple /> },
];

const PuzzleActions = (
  <SimpleGrid
    columns={{ base: 1, lg: 2 }}
    gap={{ base: "0.5", sm: "1", md: "0.5833rem", lg: "3" }}
  >
    {actions.map((action) => (
      <IconButton
        aria-label={action.label}
        aspectRatio={2 / 1}
        key={action.value}
        rounded={{ base: "sm", sm: "md" }}
        size={{ sm: "xs", md: "lg", lg: "xl" }}
        paddingTop={{ base: "1px", sm: "0px" }}
        paddingBottom={{ base: "1px", sm: "0px" }}
      >
        <Icon size={{ base: "md", md: "xl" }}>{action.icon}</Icon>
      </IconButton>
    ))}
  </SimpleGrid>
);

const DigitSVG = (props: HTMLChakraProps<"svg">) => (
  <chakra.svg
    aria-label="Digit Icon"
    fill="black"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm1-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    <path d="M13.99 10.922q0-1.14-.21-1.856t-.578-1.106q-.33-.36-.667-.495t-.743-.135q-.922 0-1.47.66t-.547 1.912q0 .706.18 1.163t.585.787q.285.233.645.312t.772.078q.48 0 1.035-.168t.968-.447l.019-.296q.012-.184.011-.409zm-5.738-.96q0-.862.282-1.574t.768-1.23q.466-.495 1.137-.773t1.361-.277q.772 0 1.399.258t1.084.747q.577.615.896 1.612t.319 2.52q0 1.388-.312 2.629t-.918 2.059q-.645.87-1.55 1.327t-2.23.457q-.3 0-.638-.033t-.63-.124v-1.432h.075q.188.104.585.202t.81.098q1.47 0 2.31-.968t.953-2.768q-.6.405-1.144.593t-1.181.187q-.623 0-1.133-.135t-1.027-.525q-.6-.457-.908-1.158t-.307-1.692z" />
  </chakra.svg>
);

const CornerSVG = (props: HTMLChakraProps<"svg">) => (
  <chakra.svg
    aria-label="Corner Icon"
    fill="black"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm1-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    <path d="M10.326 11.2H6.882v-.91h1.1V7.535h-1.1v-.85q.242 0 .48-.032t.381-.101q.168-.084.261-.226t.107-.352h1.141v4.316h1.074v.91zM17.557 11.2h-3.829v-.85q.487-.386.874-.729t.68-.65q.382-.403.553-.708t.172-.626q0-.364-.217-.558t-.606-.195q-.199 0-.376.05t-.359.125q-.178.081-.304.165l-.189.126h-.102V6.213q.221-.106.69-.216t.903-.11q.927 0 1.405.413t.478 1.162q0 .462-.217.905t-.721.95q-.315.311-.613.555t-.43.345h2.208v.983zM10.428 16.422q0 .381-.142.696t-.414.536q-.277.22-.65.337t-.908.118q-.609 0-1.045-.102t-.709-.228v-1.13h.126q.287.182.674.315t.705.133q.19 0 .412-.033t.373-.146q.119-.087.19-.215t.072-.362q0-.231-.102-.355t-.269-.18q-.168-.06-.403-.067t-.412-.007H7.7v-.917h.207q.238 0 .437-.021t.34-.084q.14-.067.219-.186t.078-.321q0-.158-.073-.258t-.182-.155q-.126-.063-.294-.084t-.287-.021q-.193 0-.392.045t-.389.116q-.147.056-.308.145t-.238.135h-.108v-1.117q.27-.115.726-.222t.933-.107q.465 0 .807.08t.582.235q.266.165.4.418t.132.573q0 .444-.257.778t-.677.433v.049q.185.028.362.094t.345.217q.157.137.26.352t.104.513z" />
  </chakra.svg>
);

const CenterSVG = (props: HTMLChakraProps<"svg">) => (
  <chakra.svg
    aria-label="Center Icon"
    fill="black"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm1-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    <path d="M11.726 14.5H8.282v-.91h1.1v-2.755h-1.1v-.85q.242 0 .48-.032t.381-.101q.168-.084.261-.226t.107-.351h1.141v4.315h1.075v.91zM15.957 14.5h-3.829v-.85q.487-.386.874-.729t.68-.65q.382-.403.553-.708t.172-.626q0-.364-.217-.558t-.606-.194q-.199 0-.376.048t-.359.126q-.178.081-.304.165l-.189.126h-.102V9.512q.221-.105.69-.215t.903-.11q.927 0 1.405.413t.478 1.162q0 .462-.217.905t-.721.95q-.315.311-.613.555t-.43.345h2.208v.983z" />
  </chakra.svg>
);

const ColorSVG = (props: HTMLChakraProps<"svg">) => (
  <chakra.svg
    aria-label="Color Icon"
    focusable="false"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g stroke="#0003" strokeWidth={0.3}>
      <path fill="#e6e6e6" d="m12 12 3.36-7.2h3.84v3.84L12 12" />
      <path fill="#b0b0b0" d="m12 12 7.2-3.36v5.29L12 12" />
      <path fill="#505050" d="m12 12 7.2 1.93v5.27h-2.16L12 12" />
      <path fill="#d1efa5" d="m12 12 5.04 7.2h-5.67L12 12" />
      <path fill="#f1b0f6" d="m12 12-.63 7.2H4.8L12 12" />
      <path fill="#f3b48f" d="m12 12-7.2 7.2v-6.57L12 12" />
      <path fill="#f39390" d="m12 12-7.2.63V6.96L12 12" />
      <path fill="#fae799" d="M12 12 4.8 6.96V4.8h5.27L12 12" />
      <path fill="#8ac1f9" d="m12 12-1.93-7.2h5.29L12 12" />
    </g>
    <path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm1-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
  </chakra.svg>
);

const inputs = [
  { value: "digit", label: "Digit", icon: <DigitSVG /> },
  { value: "colors", label: "Colors", icon: <ColorSVG /> },
  { value: "corner", label: "Corner", icon: <CornerSVG /> },
  { value: "center", label: "Center", icon: <CenterSVG /> },
];

const InputActions = (
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
        </RadioCard.Item>
      ))}
    </SimpleGrid>
  </RadioCard.Root>
);

const PlayerInterface = (
  <Stack
    alignItems="center"
    direction={{ base: "row", lg: "column" }}
    gap="4"
    minWidth={{ lg: "52" }}
  >
    {PuzzleActions}
    {NumberPad}
    {InputActions}
  </Stack>
);

const Home = () => {
  return (
    <Flex
      alignItems="center"
      direction={{ base: "column", lg: "row" }}
      fontFamily="sans-serif"
      gap="8"
    >
      {SudokuGrid}
      {PlayerInterface}
    </Flex>
  );
};

export default Home;
