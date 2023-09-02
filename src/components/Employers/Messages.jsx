import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa";
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
import React, { useState } from "react";
import inboxImg from "../../images/inbox.png";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../reducers/messageSlice";
import { useSendMessage } from "../../customhooks/useSendMessage";
import { useSignalRConnection } from "../../customhooks/useSignalRConnection";
import useWebRTC from "../../customhooks/useWebRTC";
import { VideoCall } from "./Videocall";
export function Messages() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const messages = useSelector((state) => state.messages);

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
  const connectionRef = useSignalRConnection(
    userId,
    currentRecipientId,
    dispatch,
    addMessage
  );
  const handleSendMessage = useSendMessage(toast);
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

  const {
    peerConnection,
    createOffer,
    createAnswer,
    addIceCandidate,
    createNewCall,
  } = useWebRTC(userId, currentRecipientId);

  const startVideoCall = async (recipientId) => {
    setCurrentRecipientId(recipientId);

    try {
      const offer = await createOffer();
      if (!offer) {
        throw new Error("Offer is null or undefined.");
      }

      await connectionRef.current
        .invoke(
          "StartDirectCallAsync",
          userId,
          recipientId,
          JSON.stringify(offer)
        )
        .catch((err) => console.error(err));

      setIsVideoCallOpen(true);
    } catch (error) {
      console.error("Failed to start video call", error);

      toast({
        title: "An error occurred.",
        description: "Failed to start a video call.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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

        <Box my={4}>
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
                <Flex>
                  <IconButton
                    aria-label="Start video call"
                    icon={<FaVideo />}
                    onClick={(e) => {
                      e.stopPropagation();
                      startVideoCall(applicant.applicantAppUserId);
                    }}
                    m={2}
                  />

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
        <ModalContent>
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
            <Button
              colorScheme="blue"
              onClick={() =>
                handleSendMessage(
                  inputMessage,
                  userId,
                  currentRecipientId,
                  connectionRef
                )
              }
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VideoCall peerConnection={peerConnection} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
