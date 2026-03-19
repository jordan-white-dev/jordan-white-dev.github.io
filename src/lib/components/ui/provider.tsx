"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/lib/styles/theme";
import { PropsWithChildren } from "react";

export const Provider = (props: PropsWithChildren) => (
  <ChakraProvider value={theme}>{props.children}</ChakraProvider>
);
