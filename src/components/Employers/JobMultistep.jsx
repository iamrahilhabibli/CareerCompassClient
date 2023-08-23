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
import finalcheck from "../../images/FinalCheck.png";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { VacancyFinal } from "./VacancyFinal";
import useUser from "../../customhooks/useUser";
import { useMutation, useQuery } from "react-query";
import { postVacancy } from "../../services/registerVacancy";
import { useNavigate } from "react-router-dom";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";
export function JobMultistep() {
  const [step, setStep] = useState(1);
  const { isAuthenticated, userId } = useUser();
  const [progress, setProgress] = useState(20);
  const token = localStorage.getItem("token");
  const toast = useToast();
  const navigate = useNavigate();
  const { data: recruiterDetails } = useQuery(
    ["recruiterDetails", userId],
    () => fetchRecruiterDetails(userId)
  );
  const companyId = recruiterDetails?.companyId;
  const postVacancyMutation = useMutation(
    (vacancyData) => postVacancy(vacancyData, token, userId, companyId),
    {
      onSuccess: () => {
        toast({
          title: "Vacancy Posted.",
          description: "We've posted the vacancy for you.",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        navigate("/employerscareercompass");
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
    }
  );

  const stepSchemas = [
    Yup.object().shape({
      jobTitle: Yup.string()
        .required("Job title is required")
        .matches(
          /^[a-zA-Z\s]+$/,
          "Job title can only contain letters and spaces"
        )
        .max(
          30,
          "Job title can have a maximum of 30 characters, including spaces"
        ),
      locationId: Yup.string().required("Job location ID is required"),
    }),
    Yup.object().shape({
      jobTypeIds: Yup.array()
        .required("Job type IDs are required")
        .min(1, "At least one job type ID is required"),
      shiftIds: Yup.array()
        .required("Shift IDs are required")
        .min(1, "At least one shift ID is required"),
    }),
    Yup.object().shape({
      experienceLevelId: Yup.string().required(
        "Experience level ID is required"
      ),
      salary: Yup.number()
        .required("Salary is required")
        .positive("Salary must be positive")
        .typeError("Salary must be a number"),
    }),
    Yup.object().shape({
      description: Yup.string()
        .required("Description is required")
        .min(30, "Description should contain a minimum of 30 characters"),
    }),
  ];

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      experienceLevelId: "",
      salary: 0,
      jobTypeIds: [],
      locationId: "",
      applicationLimit: 1,
      description: "",
      shiftIds: [],
    },
    validationSchema: stepSchemas[step - 1],
  });
  const handleNext = async () => {
    const currentSchema = stepSchemas[step - 1];
    try {
      await currentSchema.validate(formik.values);
      if (step < 5) {
        setStep(step + 1);
        setProgress((step / 4) * 100);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = () => {
    const values = formik.values;
    values.salary = parseFloat(values.salary);
    postVacancyMutation.mutate(values);
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
      case 5:
        return <VacancyFinal formik={formik} />;
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
            ml={"35px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Add pay and Experience level
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
      {step === 5 && (
        <Box
          borderWidth={"1px"}
          rounded={"lg"}
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
          maxWidth={800}
          bg={"white"}
          m="10px auto"
          height={"200px"}
          borderRadius={"12px"}
          bgImage={finalcheck}
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
              Confirm your post
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
                  onClick={handleSubmit}
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
