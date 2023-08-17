import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { JobTitleForm } from "./JobTitleForm";
import * as Yup from "yup";
import { JobTypeForm } from "./JobTypeForm";
import { PayBenefitsForm } from "./PayBenefitsForm";
import { JobDescriptionForm } from "./JobDescriptionForm";
import { Box, Button, ButtonGroup, Flex, Progress } from "@chakra-ui/react";
export function JobMultistep() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const stepSchemas = [
    Yup.object().shape({
      jobTitle: Yup.string().required("Job title is required"),
      location: Yup.string().required("Job location is required"),
    }),
    Yup.object().shape({
      jobType: Yup.string().required("Job type is required"),
      schedule: Yup.string().required("Schedule is required"),
    }),
    Yup.object().shape({
      pay: Yup.string().required("Pay is required"),
      benefits: Yup.string().required("Benefits are required"),
    }),
    Yup.object().shape({
      jobDescription: Yup.string().required("Job description is required"),
    }),
  ];
  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      location: "",
      jobType: "",
      schedule: "",
      pay: "",
      benefits: "",
      jobDescription: "",
    },
    validationSchema: stepSchemas[step - 1],
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const handleNext = async () => {
    try {
      await formik.validateForm();
      if (step < 3) {
        setStep(step + 1);
        setProgress(progress + 25);
      } else {
        formik.handleSubmit();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderStepContent = (currentStep) => {
    switch (currentStep) {
      case 1:
        return <JobTitleForm formik={formik} />;
      case 2:
        return <JobTypeForm formik={formik} />;
      case 3:
        return <PayBenefitsForm formik={formik} />;
      case 4:
        return <JobDescriptionForm formik={formik} />;
      default:
        return <div>Invalid step</div>;
    }
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        m="10px auto"
        bg={"white"}
      >
        <Progress
          bg={"white"}
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        />
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
