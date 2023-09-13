import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Forbidden() {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading display="inline-block" as="h2" size="2xl" color="red.500">
        401
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Forbidden
      </Text>
      <Text color={"gray.500"} mb={6}>
        You have no access to the page you are looking for.
      </Text>

      <Button
        backgroundColor="red.500"
        color="white"
        variant="solid"
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Box>
  );
}
