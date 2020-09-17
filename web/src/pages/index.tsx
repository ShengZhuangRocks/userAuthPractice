import { Box, Flex } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import ChangePassword from "../components/ChangePassword";
import Login from "../components/login";
import NavBar from "../components/Navbar";
import Register from "../components/register";
import { createUrqlClient } from "./../utils/createUrqlClient";

const Index = () => {
  return (
    <>
      <NavBar />
      <Box mx={20}>
        <Flex justifyContent="space-around">
          <Register />
          <Login />
          <ChangePassword />
        </Flex>
      </Box>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
