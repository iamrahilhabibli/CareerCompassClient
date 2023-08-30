import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";
import * as signalR from "@microsoft/signalr";
import useUser from "../../customhooks/useUser";
import inboxImg from "../../images/inbox.png";
export function JobseekerMessages() {
  const toast = useToast();
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [messages, setMessages] = useState([]);

  const fetchJobseekerContacts = async () => {
    const { data } = await axios.get(
      `https://localhost:7013/api/JobApplications/GetApprovedPositions/${userId}`
    );
    return data;
  };
  console.log(userId);
  const {
    data: jobseekerContacts,
    isLoading,
    isError,
  } = useQuery(["jobseekerContacts", userId], fetchJobseekerContacts, {
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

  const openChatWithContact = (contact) => {
    setCurrentContact(contact);
    setIsOpen(true);
  };

  const closeModal = () => {
    setCurrentContact(null);
    setIsOpen(false);
  };
  if (isLoading) return <Spinner />;
  if (isError) {
    toast({
      title: "An error occurred.",
      description: "Unable to load contacts.",
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
          {jobseekerContacts?.length > 0 ? (
            jobseekerContacts.map((contact) => (
              <Flex
                key={contact.id}
                p={3}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="md"
                justifyContent="space-between"
                onClick={() => openChatWithContact(contact)}
              >
                <Flex alignItems="center">
                  <Avatar
                    src={contact.avatar || "https://via.placeholder.com/40"}
                    size="sm"
                  />
                  <Box ml={4}>
                    <Text fontWeight="bold">{`${contact.firstName} ${contact.lastName}`}</Text>
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
                No chats available
              </Text>
            </Flex>
          )}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent width="600px">
          <ModalHeader>
            {currentContact
              ? `${currentContact.firstName} ${currentContact.lastName}`
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
