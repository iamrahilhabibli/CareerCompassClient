import React, { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import ReactHtmlParser from "html-react-parser";
import he from "he";
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  useToast,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";

function PriceWrapper(props) {
  const { children, isPopular = false } = props;
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("gray.200", "gray.500")}
      borderRadius={"xl"}
      position="relative"
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.05)" }}
    >
      {isPopular && (
        <Box
          position="absolute"
          top="-30px"
          left="50%"
          transform="translateX(-50%)"
          p="2"
          color="white"
          bg="red.500"
          borderRadius="12px"
          zIndex="1"
        >
          Most Popular
        </Box>
      )}
      {children}
    </Box>
  );
}

export default function ThreeTierPricing() {
  const toast = useToast();
  const { userId, token, userRole, isAuthenticated } = useUser();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [resumeData, setResumeData] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const isSubscriptionActive = (startDate) => {
    const subscriptionEndDate = new Date(startDate);
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);
    const currentDate = new Date();
    return currentDate < subscriptionEndDate;
  };
  const isJobSeeker = () => userRole === "JobSeeker";
  useEffect(() => {
    fetchRecruiterDetails(userId, token).then((recruiterDetails) => {
      if (recruiterDetails && recruiterDetails.subscriptionStartDate) {
        const isActive = isSubscriptionActive(
          recruiterDetails.subscriptionStartDate
        );
        setIsSubscribed(isActive);

        if (isActive) {
          toast({
            title: "Already Subscribed",
            description: "You are already subscribed to a plan.",
            status: "warning",
            duration: 10000,
            isClosable: true,
            position: "top-right",
          });
        }
      }
    });
  }, [userId, token, toast]);

  const handleStartTrialClick = (plan) => {
    if (isJobSeeker()) {
      toast({
        title: "Access Denied",
        description:
          "These plans are exclusive to recruiters. Please sign in as a recruiter to access them.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (isSubscribed) {
      toast({
        title: "Already Subscribed",
        description: "You are already subscribed to a plan.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetchRecruiterDetails(userId, token).then((recruiterDetails) => {
      const selectedPlan = {
        Name: plan.name,
        Amount: parseFloat(plan.price),
        RecruiterId: recruiterDetails.id,
      };

      axios
        .post(
          "https://localhost:7013/api/Payments/CreateCheckoutSession",
          selectedPlan
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
          console.error(
            "An error occurred while processing the payment:",
            error
          );
        });
    });
  };

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
  const defaultData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@gmail.com",
    phoneNumber: "0501111111",
    experience: "10+",
    education: "Code Academy Baku",
    description:
      "I am a highly skilled C# and ASP.NET developer with over 10 years of experience in building scalable web applications. My expertise includes designing robust backend systems, crafting efficient database structures, and implementing responsive front-end interfaces using technologies like ReactJS. I am passionate about delivering high-quality software solutions that meet and exceed client expectations. With a solid foundation in software engineering principles, I excel in problem-solving and collaborating with cross-functional teams to bring innovative ideas to life. I am committed to continuous learning, staying updated with the latest industry trends, and adapting to new technologies to deliver cutting-edge solutions.",
  };

  const prepareStructure = (structure) => {
    if (!structure || typeof structure !== "string") {
      return structure;
    }

    const replacedStructure = structure
      .replace("{{firstName}}", defaultData.firstName)
      .replace("{{lastName}}", defaultData.lastName)
      .replace("{{email}}", defaultData.email)
      .replace("{{phoneNumber}}", defaultData.phoneNumber)
      .replace("{{experience}}", defaultData.experience)
      .replace("{{education}}", defaultData.education)
      .replace("{{description}}", defaultData.description);

    return ReactHtmlParser(replacedStructure);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7013/api/Subscriptions/GetAll"
        );
        const fetchedPlans = response.data.map((plan) => ({
          name: plan.name,
          price: plan.price,
          limit: `${plan.postLimit} posts per month`,
          isChatAvailable: plan.isChatAvailable,
          isPlannerAvailable: plan.isPlannerAvailable,
          isVideoAvailable: plan.isVideoAvailable,
        }));
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);
  const fetchResumes = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7013/api/Resumes/GetResumes"
      );
      const decodedResumes = response.data.map((resume) => {
        const decodedStructure = he.decode(resume.structure);

        if (typeof decodedStructure === "string") {
          const filledStructure = prepareStructure(decodedStructure); // Assuming prepareStructure is a function that takes a string and replaces placeholders
          return {
            ...resume,
            structure: filledStructure,
          };
        }
        return resume;
      });

      setResumeData(decodedResumes);
    } catch (error) {
      toastError("Something went wrong please try again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);
  const backgroundColor = useColorModeValue("gray.50", "gray.700");
  return (
    <Box
      py={12}
      bgGradient="linear(to-r, blue.200, teal.400)"
      borderRadius="xl"
      boxShadow="md"
    >
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl" color="white">
          Plans that fit your need
        </Heading>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        {plans.map((plan, index) => (
          <Box
            key={index}
            bg="white"
            borderRadius="lg"
            boxShadow="xl"
            p={6}
            minHeight="360px"
            width={{ base: "100%", md: "340px" }}
            transition="all 0.3s"
            _hover={{ boxShadow: "2xl", transform: "scale(1.02)" }}
          >
            <VStack spacing={4}>
              <Text fontWeight="600" fontSize="2xl">
                {plan.name}
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="4xl" fontWeight="700" color="teal.500">
                  ${plan.price}
                </Text>
                <Text fontSize="xl" color="gray.500">
                  /per month
                </Text>
              </HStack>
            </VStack>
            <List spacing={3} textAlign="start" pt={4}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                {plan.limit}
              </ListItem>
              <ListItem>
                <ListIcon
                  as={plan.isChatAvailable ? FaCheckCircle : FaTimesCircle}
                  color={plan.isChatAvailable ? "green.500" : "red.500"}
                />
                Chat Available
              </ListItem>
              <ListItem>
                <ListIcon
                  as={plan.isPlannerAvailable ? FaCheckCircle : FaTimesCircle}
                  color={plan.isPlannerAvailable ? "green.500" : "red.500"}
                />
                Planner Available
              </ListItem>
              <ListItem>
                <ListIcon
                  as={plan.isVideoAvailable ? FaCheckCircle : FaTimesCircle}
                  color={plan.isVideoAvailable ? "green.500" : "red.500"}
                />
                Video Available
              </ListItem>
            </List>

            <Button
              mt={6}
              w="full"
              colorScheme="blue"
              variant="solid"
              onClick={() => handleStartTrialClick(plan)}
              isDisabled={
                plan.isFree ||
                (isSubscribed && !isJobSeeker()) ||
                !isAuthenticated
              }
              _disabled={{
                color: "gray.400",
                cursor: "not-allowed",
                backgroundColor: "gray.100",
              }}
            >
              Start Trial
            </Button>
          </Box>
        ))}
      </Stack>
      <VStack spacing={10} textAlign="center" mt={10}>
        <Heading as="h1" fontSize="4xl" color="white">
          Your Resumes
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 4, lg: 10 }}
          py={10}
          width="100%"
        >
          {resumeData.map((resume, index) => (
            <Box
              key={index}
              bg="white"
              borderRadius="lg"
              boxShadow="xl"
              p={6}
              minHeight="360px"
              width="100%"
              transition="all 0.3s"
              _hover={{ boxShadow: "2xl", transform: "scale(1.02)" }}
            >
              <VStack spacing={4}>
                <Text fontWeight="600" fontSize="2xl">
                  {resume.name}
                </Text>
              </VStack>
              <div>{prepareStructure(resume.structure)}</div>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
