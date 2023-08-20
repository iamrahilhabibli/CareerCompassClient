import React from "react";
import { Box, Avatar, Text, VStack, Flex } from "@chakra-ui/react";
import profile from "../../images/profile.png";
import useUser from "../../customhooks/useUser";

export function Profile() {
  const { userDetails, userDetailsLoading } = useUser();

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
          <Avatar size="2xl" name={userDetails?.firstName || "User"} />
        </Flex>
      </Box>
      <VStack
        spacing={4}
        padding="20px"
        alignItems="center"
        bg="white"
        borderRadius="md"
        shadow="md"
        maxWidth="600px"
        width="100%"
        margin="0 auto"
      >
        {userDetailsLoading ? (
          <Text fontSize="xl" color="gray.400">
            Loading...
          </Text>
        ) : (
          <>
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              {userDetails?.firstName} {userDetails?.lastName}
            </Text>
            <Text fontSize="lg" color="gray.500">
              Email: {userDetails?.email}
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
