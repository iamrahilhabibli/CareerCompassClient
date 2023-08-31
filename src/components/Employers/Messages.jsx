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

import React, { useEffect, useRef, useState } from "react";
import inboxImg from "../../images/inbox.png";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";

export function Messages() {
  const toast = useToast();
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const connectionRef = useRef(null);
  const [currentRecipientId, setCurrentRecipientId] = useState(null);

  const openChatWithApplicant = async (applicant) => {
    setCurrentRecipientId(applicant.applicantAppUserId);
    setCurrentApplicant(applicant);
    try {
      await connectionRef.current.invoke(
        "JoinGroup",
        userId,
        applicant.applicantAppUserId
      );
      console.log("Joined group.");
    } catch (err) {
      console.error("Error joining group: ", err);
    }
    setIsOpen(true);
  };

  const setRecipientMessages = (recipientId, message) => {
    const standardizedMessage = {
      senderId: message.senderId,
      receiverId: recipientId,
      content: message.content,
      isRead: message.isRead,
      messageType: message.messageType,
    };

    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };

      if (!updatedMessages[recipientId]) {
        updatedMessages[recipientId] = [];
      }

      updatedMessages[recipientId].push(standardizedMessage);
      console.log(
        "Updated Messages State in setRecipientMessages: ",
        updatedMessages
      );

      return updatedMessages;
    });
  };

  useEffect(() => {
    const startConnection = async () => {
      try {
        await connectionRef.current.start();
      } catch (err) {
        console.error("Error establishing connection: ", err);
      }
    };

    if (userId) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7013/chat")
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connectionRef.current = connection;

      connection.on("ReceiveMessage", (user, message) => {
        setRecipientMessages(currentRecipientId, {
          senderId: user,
          content: message,
        });
        console.log("Received SignalR Message:", user, message);
      });

      startConnection();
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [userId, currentRecipientId]);

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

  const handleSendMessage = async () => {
    if (!inputMessage || !userId || !currentRecipientId) {
      toast({
        title: "Incomplete information.",
        description: "Make sure you're logged in and a recipient is selected.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newMessage = {
      senderId: userId,
      receiverId: currentRecipientId,
      content: inputMessage,
      isRead: false,
      messageType: "Text",
    };

    console.log("New Message to be sent: ", newMessage);

    try {
      await connectionRef.current.invoke(
        "SendMessageAsync",
        userId,
        currentRecipientId,
        inputMessage
      );

      const response = await fetch("https://localhost:7013/api/Messages/Send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: data.Message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.Message);
      }
    } catch (err) {
      console.error("Error in sending message: ", err);
    }
    setRecipientMessages(currentRecipientId, newMessage);
    setInputMessage("");
  };

  const closeModal = async () => {
    setIsOpen(false);
    try {
      await connectionRef.current.invoke(
        "LeaveGroup",
        userId,
        currentRecipientId
      );
      console.log("Left group.");
    } catch (err) {
      console.error("Error leaving group: ", err);
    }
  };

  if (isLoading) return <Spinner />;
  if (isError) {
    toast({
      title: "An error occurred.",
      description: "Unable to load applicants.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return null;
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
          {approvedApplicants?.length > 0 ? (
            approvedApplicants.map((applicant) => (
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
            ))
          ) : (
            <Flex justifyContent="center" alignItems="center" height="100%">
              <Text fontSize="md" color="gray.500">
                No messages available
              </Text>
            </Flex>
          )}
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
              maxHeight="600px"
              overflowY="auto"
            >
              {messages[currentRecipientId]?.map((message, index) => (
                <Flex
                  key={index}
                  p={2}
                  flexDirection={
                    message.senderId === userId ? "row-reverse" : "row"
                  }
                >
                  <Box
                    bg={message.senderId === userId ? "blue.400" : "gray.300"}
                    p={3}
                    borderRadius="lg"
                    color={message.senderId === userId ? "white" : "black"}
                  >
                    {message.content}
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
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
