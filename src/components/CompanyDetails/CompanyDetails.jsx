"use client";

import { useState } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { registerCompany } from "../../services/registerCompany";
import { useMutation } from "react-query";

export const CompanyDetails = ({ formik }) => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Company Registration
      </Heading>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="name" fontWeight={"normal"}>
            Company Name
          </FormLabel>
          <Input
            id="name"
            placeholder="Company name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
        </FormControl>
      </Flex>
    </>
  );
};

const Form2 = ({ formik }) => {
  const COMPANY_SIZES = [
    { value: "1", label: "1-50 employees" },
    { value: "51", label: "51-100 employees" },
    { value: "101", label: "101-250 employees" },
    { value: "251", label: "251-500 employees" },
    { value: "501", label: "501-1000 employees" },
    { value: "1001", label: "1001-2500 employees" },
    { value: "2501", label: "2501-5000 employees" },
    { value: "5001", label: "5001-10000 employees" },
    { value: "10001", label: "10000+ employees" },
  ];

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Company Details
      </Heading>

      <FormControl as={GridItem} colSpan={[6, 3]}>
        <FormLabel
          htmlFor="country"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
        >
          Country / Region
        </FormLabel>
        <Select
          id="country"
          name="country"
          autoComplete="country"
          placeholder="Select option"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.country}
        >
          <option>Azerbaijan, Baku</option>
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={6}>
        <FormLabel
          htmlFor="street_address"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Street address
        </FormLabel>
        <Input
          type="text"
          name="street_address"
          id="street_address"
          autoComplete="street-address"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.street_address}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
        <FormLabel
          htmlFor="ceoName"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          CEO Name
        </FormLabel>
        <Input
          type="text"
          name="ceoName"
          id="ceoName"
          autoComplete="name"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.ceoName}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="dateFounded"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Date Founded
        </FormLabel>
        <Input
          type="text"
          name="dateFounded"
          id="dateFounded"
          autoComplete="date"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.dateFounded}
        />
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="companySize"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Company Size
        </FormLabel>
        <Select
          name="companySize"
          id="companySize"
          autoComplete="number"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.companySize}
        >
          {COMPANY_SIZES.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
        <FormLabel
          htmlFor="industryId"
          fontSize="sm"
          fontWeight="md"
          color="gray.700"
          _dark={{ color: "gray.50" }}
          mt="2%"
        >
          Choose your Industry
        </FormLabel>
        <Input
          type="text"
          name="industryId"
          id="industryId"
          autoComplete="industry"
          focusBorderColor="brand.400"
          shadow="sm"
          size="sm"
          w="full"
          rounded="md"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.industryId}
        />
      </FormControl>
    </>
  );
};

const Form3 = ({ formik }) => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal">
        Social Handles
      </Heading>

      <FormControl mt={4}>
        <FormLabel htmlFor="websiteLink">Website Link</FormLabel>
        <Input
          type="url" // changed from tel to url
          placeholder="www.yourcompany.com"
          focusBorderColor="brand.400"
          rounded="md"
          name="websiteLink"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.websiteLink}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel htmlFor="description">Company Description</FormLabel>
        <Textarea
          placeholder="Enter a brief overview of your company..."
          rows={3}
          shadow="sm"
          focusBorderColor="brand.400"
          fontSize={{
            sm: "sm",
          }}
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
      </FormControl>
    </>
  );
};

export default function Multistep() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

  const mutation = useMutation(registerCompany, {
    onSuccess: () => {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      ceoName: "",
      dateFounded: 0,
      companySize: 1,
      industryId: "",
      websiteLink: "",
      description: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
      >
        <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
        {step === 1 ? (
          <CompanyDetails formik={formik} />
        ) : step === 2 ? (
          <Form2 formik={formik} />
        ) : (
          <Form3 formik={formik} />
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            {step !== 3 && (
              <Button
                w="7rem"
                onClick={() => {
                  setStep(step + 1);
                  setProgress(progress + 33.33);
                }}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            )}
            <Button
              type="submit"
              w="7rem"
              display={step === 3 ? "block" : "none"} // Only display on the 3rd step
              colorScheme="blue"
              variant="solid"
            >
              Submit
            </Button>
          </Flex>
        </ButtonGroup>
      </Box>
    </form>
  );
}
