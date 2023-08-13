import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../Styles/Signin/Signin.module.css";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";

const login = (userSignInDto) => {
  return axios
    .post("https://localhost:7013/api/Accounts/Login", userSignInDto)
    .then((response) => response.data);
};

export function Signin() {
  const navigate = useNavigate();

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/home");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      mutation.mutate({ email: values.email, password: values.password });
    },
  });
  const bgColor = useColorModeValue("gray.50", "gray.800");
  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bgColor}>
      {mutation.isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      ) : (
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            <Box rounded={"lg"} bg={bgColor} boxShadow={"lg"} p={8}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Text color={"blue.400"}>Forgot password?</Text>
                  </Stack>
                  <Button
                    type="submit"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    isLoading={mutation.isLoading}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
            <Text align={"center"}>
              New to Career Compass?{" "}
              <Link to="/signup" className={styles.createAnAccount}>
                Create an account
              </Link>
            </Text>
          </form>
        </Stack>
      )}
    </Flex>
  );
}
