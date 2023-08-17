"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { Success } from "./Success";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export function ForgotPass() {
  const [isAttempted, setIsAttempted] = useState(false);

  const mutation = useMutation(
    (email) =>
      fetch("https://localhost:7013/api/Accounts/ForgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }),
    {
      onSettled: () => {
        setIsAttempted(true);
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      mutation.mutate(values.email);
    },
  });

  if (isAttempted) {
    return <Success />;
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        as="form"
        onSubmit={formik.handleSubmit}
        spacing={4}
        w={"full"}
        maxW={"md"}
        // bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          // color={useColorModeValue("gray.800", "gray.400")}
        >
          You&apos;ll get an email with a reset link
        </Text>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email ? (
            <Text color="red.500">{formik.errors.email}</Text>
          ) : null}
        </FormControl>
        <Stack spacing={6}>
          <Button
            type="submit"
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            isLoading={mutation.isLoading}
          >
            Request Reset
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
