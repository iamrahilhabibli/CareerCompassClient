import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import contactImg from "../../images/contactusimg.png";
import { contactValidationScheme } from "../../schemas/contactValidationScheme";
import { useFormik } from "formik";
import axios from "axios";

export default function Contact() {
  const toast = useToast();
  const toastSuccess = (message) => {
    toast({
      title: message,
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };

  const toastError = (message) => {
    toast({
      title: message,
      status: "error",
      duration: 1000,
      isClosable: true,
      position: "top-right",
    });
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      message: "",
    },
    validationSchema: contactValidationScheme,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      axios
        .post("https://localhost:7013/api/Contacts/CreateContact", values)
        .then((response) => {
          toastSuccess("Email successfully sent!");
          resetForm();
        })
        .catch((error) => {
          toastError("Something went wrong");
        });
    },
  });
  return (
    <Box
      rounded={"lg"}
      maxWidth={800}
      m="10px auto"
      borderRadius={"12px"}
      p={4}
      bg={"transparent"}
      bgGradient="linear(to-r, teal.500, green.500)"
    >
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        height={"200px"}
        bg={"white"}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgImage={contactImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Contact Us
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />

      <Box my={4} />
      <Box
        rounded={"lg"}
        bg={"white"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        p={4}
      >
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </FormControl>
          <FormControl id="surname" mt={4} isRequired>
            <FormLabel>Surname</FormLabel>
            <Input
              type="text"
              name="surname"
              onChange={formik.handleChange}
              value={formik.values.surname}
            />
          </FormControl>
          <FormControl id="email" mt={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </FormControl>
          <FormControl id="message" mt={4} isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea
              name="message"
              onChange={formik.handleChange}
              value={formik.values.message}
            />
          </FormControl>
          <Button mt={4} colorScheme="teal" type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}
