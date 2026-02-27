import { Box, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Meta } from "./components/meta";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <Box margin="0 auto" transition="0.5s ease-out">
    <Meta />
    <Flex minHeight="90vh" wrap="wrap">
      <Header />
      <Box width="full" as="main" justifyItems="center" marginY={22}>
        {children}
      </Box>
      <Footer />
    </Flex>
  </Box>
);
