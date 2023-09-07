import React from "react";
import {
  Box,
  Avatar,
  Text,
  VStack,
  Flex,
  Spinner,
  Button,
} from "@chakra-ui/react";
import profile from "../../images/profile.png";
import useUser from "../../customhooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

export function Profile() {
  const { userId } = useParams();
  const { userDetails, userDetailsLoading } = useUser(userId);
  const navigate = useNavigate();
  return (
    <Box width="70%" mx="auto" mt={10} p={5} maxWidth={800}>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        bg="white"
        m="10px auto"
        height="200px"
        borderRadius="12px"
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
        bg="transparent"
        borderRadius="md"
        shadow="1px 1px 3px rgba(0,0,0,0.6)"
        maxWidth={"100%"}
        width="100%"
        margin="0 auto"
      >
        {userDetailsLoading ? (
          <Text fontSize="xl" color="gray.400">
            <Spinner />
          </Text>
        ) : (
          <>
            <VStack spacing={3} alignItems="start" w={"100%"}>
              <Flex justifyContent="space-between" width="100%">
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  {userDetails?.firstName} {userDetails?.lastName}
                </Text>
              </Flex>
              <Flex justifyContent="space-between" width="100%">
                <Text fontSize="lg" color="gray.500">
                  Email: {userDetails?.email}
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => {
                    /* Insert logic to open email change form */
                  }}
                >
                  Change Email
                </Button>
              </Flex>
              <Flex justifyContent="space-between" width="100%">
                <Text fontSize="lg" color="gray.500">
                  Change your password
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => {
                    navigate(`/passwordreset/${userId}`);
                  }}
                >
                  Change Password
                </Button>
              </Flex>
            </VStack>
          </>
        )}
      </VStack>
    </Box>
  );
}
