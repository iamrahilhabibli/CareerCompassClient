"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export default function SuccessPayment() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Congratulations, Payment Successful!
      </Heading>
      <Text color={"gray.500"} fontSize={"lg"}>
        Thank you for your purchase! Your payment has been processed
        successfully. You will receive an email confirmation shortly. If you
        have any questions or concerns, please don't hesitate to contact us.
        Welcome to the community!
      </Text>
    </Box>
  );
}
