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
  const navigate = useNavigate();
  const borderColor = useColorModeValue("gray.200", "gray.500");
  const backgroundColor = useColorModeValue("gray.50", "gray.700");
  const { userId, token } = useUser();

  const handleStartTrialClick = (plan) => {
    fetchRecruiterDetails(userId, token).then((recruiterDetails) => {
      if (recruiterDetails && recruiterDetails.id) {
        console.log(recruiterDetails);
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
      } else {
        console.error("Recruiter details are missing");
      }
    });
  };

  const plans = [
    { name: "Free", price: "0", limit: "3 posts per month" },
    {
      name: "Basic",
      price: "149",
      limit: "10 posts per month",
      isPopular: true,
    },
    { name: "Pro", price: "349", limit: "Unlimited posts" },
  ];

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
                <Text fontSize="lpx" color="gray.500">
                  /per month
                </Text>
              </HStack>
            </Box>
            <VStack bg={backgroundColor} py={4} borderBottomRadius={"xl"}>
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
                  variant={index === 1 ? "" : "outline"}
                  onClick={() => handleStartTrialClick(plan)}
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
