"use client";
import cclogo from "../../images/cclogo.png";
import { registrationValidationSchema } from "../../schemas/registrationValidationSchema";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Select,
  HStack,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../Styles/Signup/Signup.module.css";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import axios from "axios";
export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const mutation = useMutation(
    (userRegisterDto) =>
      axios.post(
        "https://localhost:7013/api/Accounts/Register",
        userRegisterDto,
        {
          headers: { "Content-Type": "application/json" },
        }
      ),
    {
      onSuccess: () => {
        alert("Registration successful!");
        navigate("/signin");
      },
      onError: (error) => {
        alert(`An error occurred: ${error.message}`);
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: registrationValidationSchema,
    onSubmit: (values) => {
      values.role = parseInt(values.role, 10);
      console.log(values);
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            bgImage={cclogo}
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="top"
            height="max-content"
          >
            <Box textAlign={"left"}>
              <Heading size={"md"}>Ready to take the next step?</Heading>
              <Text fontSize={"md"} fontWeight={"500"}>
                Create an account or
                <Link
                  className={styles.signInLink}
                  to="/signin"
                  color={"blue.400"}
                  marginLeft={"5px"}
                  marginRight={"5px"}
                >
                  Sign in.
                </Link>
              </Text>
            </Box>

            <br />
            <Stack spacing={4}>
              <Box>
                <HStack>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Text fontSize={"15px"} color={"red"} mb="8px">
                      {formik.touched.firstName && formik.errors.firstName}
                    </Text>
                    <Input type="text" {...formik.getFieldProps("firstName")} />
                  </FormControl>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Text fontSize={"15px"} color={"red"} mb="8px">
                      {formik.touched.lastName && formik.errors.lastName}
                    </Text>
                    <Input type="text" {...formik.getFieldProps("lastName")} />
                  </FormControl>
                </HStack>
              </Box>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Text fontSize={"15px"} color={"red"} mb="8px">
                  {formik.touched.email && formik.errors.email}
                </Text>
                <Input type="email" {...formik.getFieldProps("email")} />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Text fontSize={"15px"} color={"red"} mb="8px">
                  {formik.touched.password && formik.errors.password}
                </Text>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="role" isRequired>
                <FormLabel>Register as</FormLabel>
                <Select
                  placeholder="Select role"
                  {...formik.getFieldProps("role")}
                >
                  <option value="3">Job Seeker</option>
                  <option value="2">Recruiter</option>
                </Select>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  isLoading={mutation.isLoading}
                >
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
