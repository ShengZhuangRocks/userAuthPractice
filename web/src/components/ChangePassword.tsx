import { Box, Button, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { useChangePasswordMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { InputField } from "./InputField";

interface ChangePasswordProps {}

const ChangePassword: React.FC<ChangePasswordProps> = ({}) => {
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Box p={5}>
      <Box maxWidth={800} mx="auto" w="100%" mt={16}>
        <Formik
          initialValues={{ username: "", oldPassword: "", newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword(values);
            if (response.data?.changePassword.error) {
              setErrors(toErrorMap(response.data?.changePassword.error));
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
                  name="oldPassword"
                  label="oldPassword"
                  placeholder="old password"
                  type="oldPassword"
                />
                <InputField
                  name="newPassword"
                  label="newPassword"
                  placeholder="new password"
                  type="newPassword"
                />
              </Box>
              <Flex mt={4}>
                <Button type="submit" isLoading={isSubmitting} mx="auto">
                  ChangePassword
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ChangePassword;
