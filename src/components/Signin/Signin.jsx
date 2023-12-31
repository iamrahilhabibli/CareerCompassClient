import React, { useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signin.module.css";
import logoBgRemoved from "../../images/logoBgRemoved.png";
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
import { loginValidationScheme } from "../../schemas/loginValidationScheme";

const login = (userSignInDto) => {
  return axios
    .post("https://localhost:7013/api/Accounts/Login", userSignInDto)
    .then((response) => response.data);
};

export function Signin() {
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const mutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.dispatchEvent(new Event("tokenChanged"));
      navigate("/");
    },
    onError: () => {
      setInvalidCredentials(true);
    },
  });
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
    setIsLoading(false);
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationScheme,
    onSubmit: (values) => {
      mutation.mutate({ email: values.email, password: values.password });
    },
  });

  const bgColor = useColorModeValue("gray.50", "gray.800");

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100%"
        h="100%"
        zIndex="9999"
        bg="rgba(0, 0, 0, 0.5)"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Flex
      minH={"100%"}
      align={"center"}
      justify={"center"}
      bg={bgColor}
      // bgImage={logoBgRemoved}
    >
      {mutation.isLoading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </div>
      ) : (
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          </Stack>
          <form onSubmit={formik.handleSubmit}>
            {invalidCredentials && (
              <Text color={"red.400"}>Invalid credentials</Text>
            )}
            <Box rounded={"lg"} bg={bgColor} boxShadow={"lg"} p={8}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    isInvalid={formik.touched.email && formik.errors.email}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Text
                      cursor={"pointer"}
                      onClick={() => navigate("/forgotpassword")}
                      color={"blue.400"}
                    >
                      Forgot password?
                    </Text>
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
            <Text align={"center"} mt={5}>
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
