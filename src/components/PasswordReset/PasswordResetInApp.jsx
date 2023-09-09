import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import useUser from "../../customhooks/useUser";

export default function PasswordResetInApp() {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const { userId } = useUser();
  const [showSpinner, setShowSpinner] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const mutation = useMutation(
    (passwordData) => {
      return axios.post(
        `https://localhost:7013/api/Accounts/PasswordChange/${userId}`,
        passwordData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    {
      onSuccess: () => {
        setShowSpinner(true);
        toast({
          title: "Success",
          description:
            "Password successfully changed, Redirecting you to the home page",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          setShowSpinner(false);
          navigate("/home");
        }, 3000);
      },
      onError: (error) => {
        console.error("Error during password reset:", error.response);
        console.log("Error details:", error.response.data);
        console.error("Error status code:", error.response.status);
        console.error("Error message:", error.response.data);

        toast({
          title: "Error",
          description:
            "There was an error resetting your password. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .min(8, "Must be 8 characters or more")
        .matches(
          /[A-Z]/,
          "Password must contain at least one uppercase letter."
        )
        .matches(/[0-9]/, "Password must contain at least one digit.")
        .matches(
          /[^a-zA-Z0-9]/,
          "Password must contain at least one special character."
        )
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      const requestData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      };

      console.log("Sending request with data:", requestData);
      mutation.mutate(requestData);
    },
  });
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bgColor}>
      {showSpinner ? (
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.5s"
          emptyColor="gray.200"
          color="blue.500"
        />
      ) : (
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Reset Your Password</Heading>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            <Box rounded={"lg"} bg={bgColor} boxShadow={"lg"} p={8}>
              <Stack spacing={4}>
                <FormControl id="old-password">
                  <FormLabel>Old Password</FormLabel>
                  <Input
                    type="password"
                    name="oldPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.oldPassword}
                  />
                  {formik.touched.oldPassword && formik.errors.oldPassword ? (
                    <Box color="red.500">{formik.errors.oldPassword}</Box>
                  ) : null}
                </FormControl>
                <FormControl id="new-password">
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    name="newPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                  />
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <Box color="red.500">{formik.errors.newPassword}</Box>
                  ) : null}
                </FormControl>
                <FormControl id="confirm-password">
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <Box color="red.500">{formik.errors.confirmPassword}</Box>
                  ) : null}
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    type="submit"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    isLoading={mutation.isLoading}
                  >
                    Reset Password
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </form>
        </Stack>
      )}
    </Flex>
  );
}
