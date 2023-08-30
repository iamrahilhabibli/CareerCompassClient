import {
  Avatar,
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import inboxImg from "../../images/inbox.png";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";
export function Messages() {
  const toast = useToast();
  const { userId } = useUser();

  const fetchApprovedApplicants = async () => {
    const { data } = await axios.get(
      `https://localhost:7013/api/JobApplications/GetApprovedApplicants/${userId}`
    );
    return data;
  };

  const {
    data: approvedApplicants,
    isLoading,
    isError,
  } = useQuery(["approvedApplicants", userId], fetchApprovedApplicants, {
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  const openChatWithApplicant = (applicant) => {};

  if (isLoading) return <Spinner />;
  if (isError) {
    toast({
      title: "An error occurred.",
      description: "Unable to load applicants.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
    return;
  }

  return (
    <Box
      rounded={"lg"}
      maxWidth={800}
      m="10px auto"
      borderRadius={"12px"}
      p={4}
      bg={"transparent"}
    >
      <Box
        borderWidth={"1px"}
        rounded={"lg"}
        height={"200px"}
        bg={"white"}
        bgRepeat="no-repeat"
        bgSize="auto 100%"
        bgImage={inboxImg}
        bgPosition="right"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
      >
        <Flex alignItems={"center"} ml={"50px"} width={"100%"} height={"100%"}>
          <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
            Inbox
          </Heading>
        </Flex>
      </Box>
      <Box my={4} />

      <Box my={4}>
        {approvedApplicants?.map((applicant) => (
          <Flex
            key={applicant.id}
            p={3}
            cursor="pointer"
            borderWidth="1px"
            borderRadius="md"
            onClick={() => openChatWithApplicant(applicant)}
          >
            <Avatar
              src={applicant.avatar || "https://via.placeholder.com/40"}
              size="sm"
            />
            <Box ml={4}>
              <Text fontWeight="bold">{`${applicant.firstName} ${applicant.lastName}`}</Text>
              <Text fontSize="sm">Click to chat</Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}
