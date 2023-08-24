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
  const { userId, token, userRole } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
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

  const plans = [
    { name: "Free", price: "0", limit: "3 posts per month", isFree: true },
    {
      name: "Basic",
      price: "149",
      limit: "10 posts per month",
      isPopular: true,
    },
    { name: "Pro", price: "349", limit: "Unlimited posts" },
  ];
  const backgroundColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
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
          <PriceWrapper key={index} isPopular={plan.isPopular}>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                {plan.name}
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  {plan.price}
                </Text>
                <Text fontSize="16px" color="gray.500">
                  /per month
                </Text>
              </HStack>
            </Box>
            <VStack bg={backgroundColor} py={4} borderBottomRadius="xl">
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  {plan.limit}
                </ListItem>
                {/* Add other features as required */}
              </List>
              <Box w="80%" pt={7}>
                <Button
                  w="full"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleStartTrialClick(plan)}
                  isDisabled={plan.isFree || (isSubscribed && !isJobSeeker())}
                  _disabled={{
                    color: "gray.400",
                    cursor: "not-allowed",
                    backgroundColor: "gray.100",
                  }}
                >
                  Start trial
                </Button>
              </Box>
            </VStack>
          </PriceWrapper>
        ))}
      </Stack>
    </Box>
  );
}
