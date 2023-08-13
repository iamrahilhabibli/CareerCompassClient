"use client";
import { registrationValidationSchema } from "../../schemas/registrationValidationSchema";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useMutation } from "react-query";
import { ErrorMessage, useFormik } from "formik";
import axios from "axios";
export function Signup() {
  const [showPassword, setShowPassword] = useState(false);

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
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input type="text" {...formik.getFieldProps("firstName")} />
                    <Text fontSize={"15px"} color={"red"} mb="8px">
                      {formik.touched.firstName && formik.touched.firstName}
                    </Text>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input type="text" {...formik.getFieldProps("lastName")} />
                    <Text fontSize={"15px"} color={"red"} mb="8px">
                      {formik.touched.lastName && formik.touched.lastName}
                    </Text>
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email">
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
                <FormLabel>Role</FormLabel>
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
