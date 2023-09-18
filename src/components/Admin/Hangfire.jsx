import { Box, Text } from "@chakra-ui/react";
import React from "react";

export default function Hangfire() {
  return (
    <Box width="100%" p={4}>
      <Text fontSize="2xl" mb={4}>
        Hangfire Dashboard
      </Text>
      <Box
        as="iframe"
        src="https://localhost:7013/hangfire"
        width="100%"
        height="800px"
        title="Hangfire Dashboard"
        borderRadius="md"
        boxShadow="md"
      ></Box>
    </Box>
  );
}
