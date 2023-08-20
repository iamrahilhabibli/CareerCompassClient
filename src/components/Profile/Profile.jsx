import React from "react";
import { Box, Avatar, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import profile from "../../images/profile.png";
export function Profile() {
  return (
    <Box>
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
        bgImage={profile}
        bgSize="auto 100%"
        bgPosition="right"
        position="relative"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Avatar size="2xl" name="Rahil" />
        </Flex>
      </Box>
      <VStack spacing={4} padding="20px" alignItems="center">
        <Text fontSize="xl">Name: Rahil</Text>
        <Text fontSize="xl">Email: rahil@example.com</Text>
      </VStack>
      <Box
        bg="gray.200"
        padding="10px"
        position="absolute"
        width="100%"
        bottom="0"
      >
        <Text textAlign="center">This is the footer content</Text>
      </Box>
    </Box>
  );
}
