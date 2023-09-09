import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import resumeImg from "../../images/resumecreate.png";
import { fetchJobSeekerDetails } from "../../services/fetchJobSeekerDetails";
import { loadStripe } from "@stripe/stripe-js";
import { Editor } from "@tinymce/tinymce-react";
import {
  Box,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Button,
  VStack,
  Flex,
  Select,
} from "@chakra-ui/react";
import useUser from "../../customhooks/useUser";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { setContent, setLoading } from "../../reducers/resumeSlice";

export function ResumeBuild() {
  const [isLoading, setIsLoading] = useState(true);
  const [educationLevels, setEducationLevels] = useState([]);
  const [isResumeCreated, setIsResumeCreated] = useState(false);
  const [localState, setLocalState] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [resumeCreated, setResumeCreated] = useState(false);
  const { content, download: triggerDownload } = useSelector(
    (state) => state.resume
  );

  const dispatch = useDispatch();
  const resumePreviewRef = useRef(null);
  const toast = useToast();
  const handleCreateResume = () => {
    setResumeCreated(true);
  };
  const { userId, token } = useUser();
  const YearsOfExperienceOptions = [
    { label: "Less Than 1", value: 0 },
    { label: "1 to 3", value: 1 },
    { label: "4 to 6", value: 2 },
    { label: "7 to 9", value: 3 },
    { label: "10 to 12", value: 4 },
    { label: "13 to 15", value: 5 },
    { label: "16 to 18", value: 6 },
    { label: "19 to 20", value: 7 },
    { label: "20 Plus", value: 8 },
  ];
  const resumePlans = [
    { name: "Basic", price: "14.99", description: "Basic Resume Plan" },
  ];
  useEffect(() => {
    const fetchEducationLevels = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/EducationLevels/GetAll"
        );
        setEducationLevels(response.data);
      } catch (error) {
        console.error("Error fetching education levels:", error);
      }
    };

    fetchEducationLevels();
  }, []);

  useEffect(() => {
    if (content && resumePreviewRef.current) {
      resumePreviewRef.current.innerHTML = content;
    }
  }, [content]);

  const renderPreview = (values) => {
    const educationName = educationLevels.find(
      (level) => level.id === values.education
    )?.name;

    const contentData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      experience: values.experience,
      education: educationName,
      description: values.description,
    };
    dispatch(setContent(contentData));
    setLocalState(contentData);
    localStorage.setItem("resumeContent", JSON.stringify(contentData));
  };

  const mutation = useMutation(
    (values) => {
      const dataToSend = {
        experience: values.experience,
        educationLevelId: values.education,
        skills: values.skills,
        description: values.description,
        phoneNumber: values.phoneNumber,
      };
      return axios.post(
        `https://localhost:7013/api/JobSeekers/Post?userId=${userId}`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        setShowPreview(true);
        setIsResumeCreated(true);
        toast({
          title: "Success",
          description:
            "Resume created successfully! You can now click to pay and download.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      experience: 0,
      education: "",
      description: "",
      phoneNumber: "",
    },
    onSubmit: (values) => {
      const experience = parseInt(values.experience, 10);
      const dataToSend = {
        experience,
        education: values.education,
        description: values.description,
        phoneNumber: values.phoneNumber,
      };
      renderPreview(values);
      mutation.mutate(dataToSend, {
        onSuccess: () => {
          setShowPreview(true);
          setIsResumeCreated(true);
        },
        onError: (error) => {
          console.error("Error submitting data:", error);
        },
      });
    },
  });

  useEffect(() => {
    fetchJobSeekerDetails(userId, token).then((details) => {
      if (details) {
        formik.setFieldValue("firstName", details.firstName);
        formik.setFieldValue("lastName", details.lastName);
        formik.setFieldValue("email", details.email);
        formik.setFieldValue("phoneNumber", details.phoneNumber);
      }
    });
  }, [userId, token]);

  const initiatePaymentProcess = (selectedPlan) => {
    if (!selectedPlan) {
      console.error("Selected plan must be provided.");
      return;
    }

    const { name, price } = selectedPlan;
    const jobSeekerId = userId;

    const paymentDetails = {
      jobSeekerId,
      name,
      amount: parseFloat(price),
    };

    axios
      .post(
        "https://localhost:7013/api/Payments/CreateResumeCheckoutSession",
        paymentDetails
      )
      .then(async (response) => {
        toast({
          title: "Redirecting",
          description: "Redirecting you to the checkout page",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        const sessionId = response.data.sessionId;
        const stripePublishableKey =
          process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
        const stripe = await loadStripe(stripePublishableKey);
        stripe && stripe.redirectToCheckout({ sessionId });
      })
      .catch((error) => {
        console.error("An error occurred while processing the payment:", error);
      });
  };
  const defaultTemplate = `
  <h1><strong>Education:</strong></h1>
  <ul>
    <li></li>
  </ul>
  <h1><strong>Skills:</strong></h1>
  <ul>
    <li></li>
  </ul>
  <h1><strong>Interests:</strong></h1>
  <ul>
    <li></li>
  </ul>
`;
  return (
    <>
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        bg={"white"}
        m="10px auto"
        height={"200px"}
        borderRadius={"12px"}
        bgRepeat="no-repeat"
        bgImage={resumeImg}
        bgSize="auto 100%"
        bgPosition="right"
        position="relative"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Create your resume
          </Heading>
        </Flex>
      </Box>
      <VStack spacing={4} align="center" w="100%">
        <Flex direction="column" w={["90%", "80%", "70%", "60%"]}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="firstName"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                First Name
              </FormLabel>
              <Input
                id="firstName"
                name="firstName"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="lastName"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Last Name
              </FormLabel>
              <Input
                id="lastName"
                name="lastName"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="email"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Email
              </FormLabel>
              <Input
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl mb={"20px"}>
              <FormLabel
                htmlFor="phoneNumber"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Phone number
              </FormLabel>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                // isReadOnly
                bg="gray.100"
              />
            </FormControl>

            <FormControl isRequired mb={"20px"}>
              <FormLabel
                htmlFor="experience"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Years of Experience
              </FormLabel>

              <Select
                name="experience"
                id="experience"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.experience}
              >
                <option value="" disabled>
                  Select option
                </option>
                {YearsOfExperienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired mb={"20px"}>
              <FormLabel
                htmlFor="education"
                fontWeight="md"
                color="gray.700"
                _dark={{ color: "gray.50" }}
              >
                Education Level
              </FormLabel>
              <Select
                name="education"
                id="education"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.education}
              >
                <option value="" disabled>
                  Select option
                </option>
                {educationLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Editor
              apiKey="ampk5o36dpm7qqhr2h54evb0g8b4fqptomyoa5ntgpubk2h4"
              value={formik.values.description || defaultTemplate}
              id="description"
              init={{
                height: 300,
                menubar: false,
                plugins:
                  "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={(content) =>
                formik.setFieldValue("description", content)
              }
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={mutation.isLoading}
              leftIcon={mutation.isLoading ? <Spinner /> : null}
              onClick={handleCreateResume}
            >
              Create Resume
            </Button>
          </form>

          {resumeCreated &&
            resumePlans.map((plan, index) => (
              <Button key={index} onClick={() => initiatePaymentProcess(plan)}>
                Pay and Download {plan.name} for {plan.price}
              </Button>
            ))}
        </Flex>
      </VStack>
    </>
  );
}
