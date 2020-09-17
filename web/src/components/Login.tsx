import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { useLoginMutation } from "../generated/graphql";
import { InputField } from "./InputField";
import { toErrorMap } from "./../utils/toErrorMap";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [, login] = useLoginMutation();
  return (
    <Box p={5}>
      <Box maxWidth={800} mx="auto" w="100%" mt={16}>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.error) {
              setErrors(toErrorMap(response.data?.login.error));
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box h={300}>
                <InputField
                  name="username"
                  label="username"
                  placeholder="username"
                />
                <InputField
                  name="password"
                  label="password"
                  placeholder="password"
                  type="password"
                />
              </Box>
              <Flex mt={4}>
                <Button type="submit" isLoading={isSubmitting} mx="auto">
                  Login
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Login;
