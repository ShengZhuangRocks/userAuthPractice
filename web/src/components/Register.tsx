import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { InputField } from "./InputField";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useRegisterMutation();
  return (
    <Box p={5}>
      <Box maxWidth={800} mx="auto" w="100%" mt={16}>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register(values);
            if (response.data?.register.error) {
              setErrors(toErrorMap(response.data?.register.error));
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
                  Register
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default Register;
