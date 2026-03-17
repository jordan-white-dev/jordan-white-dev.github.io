import { Box, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Footer } from "./components/footer";
import { Meta } from "./components/meta";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <Box margin="0 auto" transition="0.5s ease-out">
    <Meta />
    <Flex minHeight="90vh" wrap="wrap" justifyContent="center">
      {children}

      <Footer />
    </Flex>
  </Box>
);
