import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
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
  const [isSubscribed, setIsSubscribed] = useState(false);
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
        }));
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
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
    </Box>
  );
}
