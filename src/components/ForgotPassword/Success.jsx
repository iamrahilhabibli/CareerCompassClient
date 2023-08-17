"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export function Success() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Password Reset Requested
      </Heading>
      <Text color={"gray.500"}>
        A password reset link has been sent to your email. Please check your
        inbox and follow the instructions to reset your password.
      </Text>
    </Box>
  );
}
