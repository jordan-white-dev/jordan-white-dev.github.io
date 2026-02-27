import { Box } from "@chakra-ui/react";

import { Header } from "./components/header";
import { Puzzle } from "./components/puzzle";

const Home = () => {
  return (
    <>
      <Header />
      <Box width="full" as="main" justifyItems="center" marginY={22}>
        <Puzzle />
      </Box>
    </>
  );
};

export default Home;
