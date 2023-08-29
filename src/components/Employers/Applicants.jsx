import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import applicants from "../../images/applicants.png";
export function Applicants() {
  return (
    <Box
      borderWidth={"1px"}
      rounded={"lg"}
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      maxWidth={800}
      bg={"white"}
      m="10px auto"
      height={"200px"}
      borderRadius={"12px"}
      bgRepeat="no-repeat"
      bgSize="auto 100%"
      bgPosition="right"
      bgImage={applicants}
      position="relative"
    >
      <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
        <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
          Review your Applicants
        </Heading>
      </Flex>
    </Box>
  );
}
