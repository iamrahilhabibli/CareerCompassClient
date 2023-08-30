import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import * as signalR from "@microsoft/signalr";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import inboxImg from "../../images/inbox.png";
import { MessageBox } from "react-chat-elements";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";
export function Messages() {
  const toast = useToast();
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [messages, setMessages] = useState([]);

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
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7013/chat")
    .configureLogging(signalR.LogLevel.Information)
    .build();

  useEffect(() => {
    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR Hub");

        connection.on("ReceiveMessage", (user, message) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: user, text: message },
          ]);
        });
      })
      .catch((err) =>
        console.log("Error while establishing the connection :(", err)
      );
  }, []);

  const openChatWithApplicant = (applicant) => {
    setCurrentApplicant(applicant);
    setIsOpen(true);
  };
  const closeModal = () => {
    setCurrentApplicant(null);
    setIsOpen(false);
  };

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
    <>
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
          <Flex
            alignItems={"center"}
            ml={"50px"}
            width={"100%"}
            height={"100%"}
          >
            <Heading color={"#2D2D2D"} fontSize={"28px"} as="h5" size="md">
              Inbox
            </Heading>
          </Flex>
        </Box>
        <Box my={4} />

        <Box
          my={4}
          borderWidth={"1px"}
          rounded={"lg"}
          height={"200px"}
          bg={"white"}
          bgRepeat="no-repeat"
          bgSize="auto 100%"
          bgPosition="right"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
        >
          {approvedApplicants?.map((applicant) => (
            <Flex
              key={applicant.id}
              p={3}
              cursor="pointer"
              borderWidth="1px"
              borderRadius="md"
              justifyContent="space-between"
              onClick={() => openChatWithApplicant(applicant)}
            >
              <Flex alignItems="center">
                <Avatar
                  src={applicant.avatar || "https://via.placeholder.com/40"}
                  size="sm"
                />
                <Box ml={4}>
                  <Text fontWeight="bold">{`${applicant.firstName} ${applicant.lastName}`}</Text>
                  <Text fontSize="sm">Click to chat</Text>
                </Box>
              </Flex>
              <Button
                colorScheme="red"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Delete
              </Button>
            </Flex>
          ))}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent width="600px">
          <ModalHeader>
            {currentApplicant
              ? `${currentApplicant.firstName} ${currentApplicant.lastName}`
              : ""}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Box
              flex="1"
              bg="gray.100"
              border="1px"
              maxHeight="600px" // Increasing the height here
              overflowY="auto" // Adding scroll
            >
              {messages.map((message, index) => (
                <Flex
                  key={index}
                  p={2}
                  flexDirection={
                    message.sender === "Rahil" ? "row-reverse" : "row"
                  }
                >
                  <Box
                    bg={message.sender === "Rahil" ? "blue.400" : "gray.300"}
                    p={3}
                    borderRadius="lg"
                    color={message.sender === "Rahil" ? "white" : "black"}
                  >
                    {message.text}
                  </Box>
                </Flex>
              ))}
            </Box>
          </ModalBody>
          <ModalFooter p={2} bg="gray.200">
            <Input
              placeholder="Type your message..."
              variant="filled"
              size="md"
              borderRadius="full"
              mr={2}
            />
            <Button colorScheme="blue">Send</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
