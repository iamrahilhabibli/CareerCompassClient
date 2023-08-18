import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { JobTitleForm } from "./JobTitleForm";
import * as Yup from "yup";
import { JobTypeForm } from "./JobTypeForm";
import { PayBenefitsForm } from "./PayBenefitsForm";
import { JobDescriptionForm } from "./JobDescriptionForm";
import jobsearch from "../../images/jobsearch-removebg-preview.png";
import jobdetails from "../../images/jobdetails.png";
import jobpay from "../../images/jobpay.png";
import jobdescription from "../../images/jobdescription.png";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Progress,
} from "@chakra-ui/react";
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
      experienceLevelId: "",
      salary: 0,
      jobTypeId: "",
      jobLocationId: "",
      description: "",
      shifts: [],
    },
    validationSchema: stepSchemas[step - 1],
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const handleNext = () => {
    if (step === 5) {
      formik.handleSubmit();
    } else {
      setStep(step + 1);
      setProgress((step / 5) * 100);
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
    <>
      {step === 1 && (
        <Box
          borderWidth={"1px"}
          rounded={"lg"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgImage={jobsearch}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgPosition="right"
          position="relative"
        >
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Create a job post
            </Heading>
          </Flex>
        </Box>
      )}
      {step === 2 && (
        <Box
          borderWidth={"1px"}
          rounded={"lg"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgImage={jobdetails}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgPosition="right"
          position="relative"
        >
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Add job details
            </Heading>
          </Flex>
        </Box>
      )}
      {step === 3 && (
        <Box
          borderWidth={"1px"}
          rounded={"lg"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgImage={jobpay}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgPosition="right"
          position="relative"
        >
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Add pay and benefits
            </Heading>
          </Flex>
        </Box>
      )}
      {step === 4 && (
        <Box
          borderWidth={"1px"}
          rounded={"lg"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgImage={jobdescription}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgPosition="right"
          position="relative"
        >
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Describe the job
            </Heading>
          </Flex>
        </Box>
      )}
      <br />
      <br />
      <form onSubmit={formik.handleSubmit}>
        <Box
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          m="auto"
          p={6}
          bg={"white"}
        >
          <Progress
            hasStripe
            value={progress}
            mb="5%"
            mx="5%"
            mt={"15px"}
            isAnimated
            borderRadius={"8px"}
          />
          {renderStepContent(step)}
          <ButtonGroup mt="5%" w="100%">
            <Flex w="100%" justifyContent="space-between">
              {step < 5 ? (
                <Button
                  w="7rem"
                  onClick={handleNext}
                  colorScheme="blue"
                  variant="outline"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  w="7rem"
                  colorScheme="blue"
                  variant="solid"
                >
                  Submit
                </Button>
              )}
            </Flex>
          </ButtonGroup>
        </Box>
      </form>
    </>
  );
}
