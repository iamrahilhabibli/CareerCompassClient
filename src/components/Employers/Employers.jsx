import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Spinner, VStack } from "@chakra-ui/react";
import useUser from "../../customhooks/useUser";
import { fetchRecruiterDetails } from "../../services/fetchRecruiterDetails";

export function Employers() {
  const { userId, token } = useUser();
  const [recruiterDetails, setRecruiterDetails] = useState(null);

  useEffect(() => {
    if (userId && token) {
      fetchRecruiterDetails(userId, token).then((details) => {
        console.log(details);
        setRecruiterDetails(details);
      });
    }
  }, [userId, token]);

  return (
    <Box p={8} bgGradient="linear(to-r, gray.100, gray.300)">
      <VStack spacing={6} align="stretch">
        {recruiterDetails ? (
          <Box p={6} rounded={"lg"} bg="white" shadow="md" borderWidth={"1px"}>
            <Heading as="h1" size="2xl" color="blue.700">
              Welcome, {recruiterDetails.firstName.toUpperCase()}{" "}
              {recruiterDetails.lastName.toUpperCase()}
            </Heading>
            <Text mt={4}>
              We are delighted to have you on board! Feel free to browse through
              the list of potential candidates and manage your job postings.
            </Text>
          </Box>
        ) : (
          <Box p={6} rounded={"lg"} bg="white" shadow="md">
            <Spinner size="xl" />
            <Text mt={4}>Loading...</Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
