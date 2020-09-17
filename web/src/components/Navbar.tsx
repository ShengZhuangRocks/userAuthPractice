import React from "react";
import NextLink from "next/link";
import { Link, Flex, Box, Button, Heading } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { useCurrentUserQuery, useLogoutMutation } from "../generated/graphql";
import Logout from "./Logout";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useCurrentUserQuery();
  const [, logout] = useLogoutMutation();

  let body = null;
  if (fetching) {
  } else if (!data?.currentUser) {
    // user not logged in
    body = (
      <Flex flex={1} mx={20} align="center">
        <Box>Currently no user logged in</Box>
      </Flex>
    );
  } else {
    body = (
      <Flex flex={1} mx={20} align="center">
        <Box>User: {data.currentUser.username} </Box>
        <Button ml="auto" onClick={() => logout()}>
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={4}>
      {body}
    </Flex>
  );
};

export default NavBar;
