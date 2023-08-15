"use client";

import { useEffect, useState } from "react";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { registerCompany } from "../../services/registerCompany";
import { useMutation } from "react-query";
import { CompanyDetailsForm } from "./CompanyDetailsForm";
import { CompanyDetailsAbout } from "./CompanyDetailsAbout";
import useUser from "../../customhooks/useUser";
import { useNavigate } from "react-router-dom";

export const CompanyDetails = ({ formik }) => {
  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Company Registration
      </Heading>
      <Flex>
        <FormControl mr="5%" isRequired>
          <FormLabel htmlFor="name" fontWeight={"normal"}>
            Company Name
          </FormLabel>
          <Text fontSize={"15px"} color={"red"} mb="8px">
            {formik.touched.name && formik.errors.name}
          </Text>
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
export default function Multistep() {
  const { isAuthenticated } = useUser();
  const token = localStorage.getItem("token");

  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);
  const navigate = useNavigate();

  const mutation = useMutation((values) => registerCompany(values, token), {
    onSuccess: () => {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    },
  });

  const stepSchemas = [
    Yup.object().shape({
      name: Yup.string().required("Company name is required"),
    }),
    Yup.object().shape({
      ceoName: Yup.string().required("CEO name is required"),
    }),
    Yup.object().shape({
      dateFounded: Yup.number()
        .required("Date founded is required")
        .min(1900, "Please enter a valid year")
        .max(
          new Date().getFullYear(),
          "Date founded cannot be after the current year"
        ),
    }),
  ];

  const [validationSchema, setValidationSchema] = useState(stepSchemas[0]);

  useEffect(() => {
    setValidationSchema(stepSchemas[step - 1]);
  }, [step]);

  const formik = useFormik({
    initialValues: {
      name: "",
      ceoName: "",
      dateFounded: 0,
      address: "",
      companySize: 1,
      industryId: "",
      websiteLink: "",
      description: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
      values.companySize = parseInt(values.companySize, 10);
    },
    validationSchema: validationSchema,
  });

  const handleNext = async () => {
    const currentSchema = stepSchemas[step - 1];
    try {
      await currentSchema.validate(formik.values);
      setStep(step + 1);
      setProgress(progress + 33.33);
    } catch (err) {
      console.log(err);
    }
  };

  const renderStepContent = (currentStep) => {
    switch (currentStep) {
      case 1:
        return <CompanyDetails formik={formik} />;
      case 2:
        return <CompanyDetailsForm formik={formik} />;
      case 3:
        return <CompanyDetailsAbout formik={formik} />;
      default:
        return <div>Invalid step</div>;
    }
  };
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate("/signin");
  //   }
  // }, [isAuthenticated, navigate]);
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
        {renderStepContent(step)}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            {step !== 3 && (
              <Button
                w="7rem"
                onClick={handleNext}
                colorScheme="teal"
                variant="outline"
              >
                Next
              </Button>
            )}
            <Button
              type="submit"
              w="7rem"
              display={step === 3 ? "block" : "none"}
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
