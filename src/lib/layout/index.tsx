import { Box, Flex } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

import { Footer } from "@/lib/layout/components/footer";
import { Meta } from "@/lib/layout/components/meta";

export const Layout = ({ children }: PropsWithChildren) => (
  <Box margin="0 auto" transition="0.5s ease-out">
    <Meta />
    <Flex minHeight="90vh" wrap="wrap" justifyContent="center">
      {children}

      <Footer />
    </Flex>
  </Box>
);
