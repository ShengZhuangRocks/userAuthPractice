import { Box, Button, Flex } from "@chakra-ui/core";
import React from "react";
import { useLogoutMutation } from "../generated/graphql";

interface LogoutProps {}

const Logout: React.FC<LogoutProps> = ({}) => {
  const [, logout] = useLogoutMutation();
  return (
    <Box p={5}>
      <Box maxWidth={800} mx="auto" w="100%" mt={16}>
        <Box h={300}></Box>
        <Flex mt={4}>
          <Button type="submit" onClick={() => logout()} mx="auto">
            Logout
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Logout;
