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
import React, { useEffect, useRef, useState } from "react";
import inboxImg from "../../images/inbox.png";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import axios from "axios";
import { useQuery } from "react-query";
import useUser from "../../customhooks/useUser";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../reducers/messageSlice";
import { useSendMessage } from "../../customhooks/useSendMessage";
import { useSignalRConnection } from "../../customhooks/useSignalRConnection";
import useWebRTC from "../../customhooks/useWebRTC";
import { VideoCall } from "./Videocall";
import useUserMedia from "../../customhooks/useUserMedia";
export function Messages() {
  const dispatch = useDispatch();
  const toast = useToast();
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [addedTrackIds, setAddedTrackIds] = useState(new Set());

  const {
    mediaStream,
    error: mediaError,
    startMedia,
  } = useUserMedia({
    video: true,
    audio: true,
  });
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
  const videoConnectionRef = useRef(null);

  useEffect(() => {
    videoConnectionRef.current = new HubConnectionBuilder()
      .withUrl("https://localhost:7013/video")
      .withAutomaticReconnect([0, 1000, 5000, 10000])
      .configureLogging(LogLevel.Information)
      .build();

    videoConnectionRef.current
      .start()
      .then(() => {
        console.log("VideoHub connected");
      })
      .catch((err) => {
        console.log("Error while establishing VideoHub connection: ", err);
      });

    videoConnectionRef.current.on(
      "ReceiveDirectCallAnswer",
      (callerId, answerJson) => {
        console.log("Received answer:", answerJson);
      }
    );

    return () => {
      videoConnectionRef.current.stop().catch((err) => {
        console.log("Error stopping VideoHub connection:", err);
      });
    };
  }, []);

  const { peerConnection, createOffer } = useWebRTC(
    userId,
    currentRecipientId,
    videoConnectionRef
  );

  const handleStartVideoCall = async (recipientId) => {
    const stream = await startMedia();
    if (stream) {
      startVideoCall(recipientId, stream);
    } else {
      console.log("No MediaStream available.");
      toast({
        title: "No MediaStream available",
        description:
          "Please grant permission to access your camera and microphone.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const startVideoCall = async (recipientId, mediaStream) => {
    try {
      console.log("Starting video call...");
      setCurrentRecipientId(recipientId);
      console.log("MediaStream started:", mediaStream);

      if (!videoConnectionRef.current) {
        console.log("VideoHub Connection is not available.");
        return;
      }

      mediaStream.getTracks().forEach((track) => {
        if (!addedTrackIds.has(track.id)) {
          peerConnection.addTrack(track, mediaStream);
          const newSet = new Set(addedTrackIds);
          newSet.add(track.id);
          setAddedTrackIds(newSet);
        } else {
          console.log("Call already in progress");
          toast({
            title: "Call already in progress",
            description:
              "You have already started a call. Please end the current call before starting a new one.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      });

      const offer = await createOffer();
      console.log("Offer created:", offer);

      if (!offer) {
        toast({
          title: "Something went wrong!",
          description: "Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log("ICE candidate generated:", event.candidate);

          if (
            videoConnectionRef.current.state === HubConnectionState.Connected
          ) {
            await sendIceCandidate(recipientId, event.candidate);
          }
        }
      };

      if (videoConnectionRef.current.state === HubConnectionState.Connected) {
        await joinAndStartCall(userId, recipientId, offer);
      } else {
        throw new Error(
          "VideoHub Connection is not available or not connected"
        );
      }

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

  const sendIceCandidate = async (recipientId, candidate) => {
    try {
      console.log("Invoking SendIceCandidate in sendIceCandidate");
      await videoConnectionRef.current.invoke(
        "SendIceCandidate",
        recipientId,
        JSON.stringify(candidate)
      );
    } catch (error) {
      console.log("Error sending ICE candidate:", error);
    }
  };

  const joinAndStartCall = async (userId, recipientId, offer) => {
    console.log("Invoking JoinGroup...");
    await videoConnectionRef.current.invoke("JoinGroup", userId, recipientId);
    console.log("Invoking StartDirectCallAsync...");
    await videoConnectionRef.current.invoke(
      "StartDirectCallAsync",
      userId,
      recipientId,
      JSON.stringify(offer)
    );
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
  console.log("Rendering with mediaStream: ", mediaStream); // Logging right before rendering VideoCall component
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
                      handleStartVideoCall(applicant.applicantAppUserId);
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
            <VideoCall
              peerConnection={peerConnection}
              mediaStream={mediaStream}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
