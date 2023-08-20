"use client";

import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function SomethingWentWrong() {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading display="inline-block" as="h2" size="2xl" color="#2557a7">
        Oops...
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Something went wrong
      </Text>
      <Text color={"gray.500"} mb={6}>
        Please try again later
      </Text>

      <Button
        backgroundColor="#2557a7"
        color="white"
        variant="solid"
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Box>
  );
}
