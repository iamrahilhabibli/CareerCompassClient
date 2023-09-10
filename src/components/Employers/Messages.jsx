import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import audioFile from "./ringing-151670.mp3";
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
import { loadInitialMessages } from "../../reducers/messageSlice";
import { useSendMessage } from "../../customhooks/useSendMessage";
import { useSignalRConnection } from "../../customhooks/useSignalRConnection";
import useWebRTC from "../../customhooks/useWebRTC";
import { VideoCall } from "./Videocall";
import useUserMedia from "../../customhooks/useUserMedia";
export function Messages() {
  const dispatch = useDispatch();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationIdToDelete, setApplicationIdToDelete] = useState(null);
  const onCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const cancelRef = useRef();

  const toast = useToast();
  const [isLoadingPeerConnection, setIsLoadingPeerConnection] = useState(true);
  const { userId, token } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [addedTrackIds, setAddedTrackIds] = useState(new Set());
  const audio = new Audio(audioFile);
  const showToastError = (errorMessage) => {
    toast({
      title: "An error occurred.",
      description: errorMessage,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };
  const {
    mediaStream,
    error: mediaError,
    startMedia,
    stopMedia,
  } = useUserMedia({ video: true, audio: true });
  const messages = useSelector((state) => state.messages);
  const openChatWithApplicant = async (applicant) => {
    setCurrentRecipientId(applicant.applicantAppUserId);
    console.log(applicant.applicantAppUserId);
    console.log(applicant);
    setCurrentApplicant(applicant);
    try {
      await connectionRef.current.invoke(
        "JoinGroup",
        userId,
        applicant.applicantAppUserId
      );
      console.log("Joined group.");

      fetch(
        `https://localhost:7013/api/Messages/GetMessages?senderId=${userId}&receiverId=${applicant.applicantAppUserId}`
      )
        .then((response) => response.json())
        .then((data) => {
          dispatch(
            loadInitialMessages({
              recipientId: applicant.applicantAppUserId,
              messages: data,
            })
          );
        })

        .catch((error) => console.error("Error fetching messages:", error));
    } catch (err) {
      console.error("Error joining group: ", err);
    }
    setIsOpen(true);
  };

  //   try {
  //     await axios.delete(
  //       `https://localhost:7013/api/JobApplications/RemoveApplication?applicationId=${applicationId}`
  //     );
  //     setIsDeleteDialogOpen(false);
  //   } catch (err) {
  //     console.error("Error deleting the application", err);
  //   }
  // };
  const deleteApplication = async (applicationId) => {
    try {
      await axios.delete(
        `https://localhost:7013/api/JobApplications/RemoveApplication?applicationId=${applicationId}`
      );
      toast({
        title: "Application deleted.",
        status: "success",
        isClosable: true,
      });
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // Handle the error here
    }
  };

  const connectionRef = useSignalRConnection(
    userId,
    currentRecipientId,
    dispatch,
    addMessage
  );
  const playRingingSound = () => {
    audio.loop = true;
    audio
      .play()
      .then(() => {
        console.log("Audio played successfully");
      })
      .catch((error) => {
        console.error("Failed to play audio:", error);
      });
  };
  const stopRingingSound = () => {
    audio.loop = false;
    audio.pause();
    audio.currentTime = 0;
  };

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
    refetch,
  } = useQuery(["approvedApplicants", userId], fetchApprovedApplicants, {
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  const videoConnectionRef = useRef(null);

  const {
    peerConnection,
    createOffer,
    endConnection,
    initializePeerConnection,
    addIceCandidate,
  } = useWebRTC(userId, currentRecipientId, videoConnectionRef);
  useEffect(() => {
    if (peerConnection) {
      setIsLoadingPeerConnection(false);
    } else {
      setIsLoadingPeerConnection(true);
    }
  }, [peerConnection]);

  const handleStartVideoCall = async (recipientId) => {
    const stream = await startMedia();
    if (stream) {
      // playRingingSound();
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
      setCurrentRecipientId(recipientId);

      if (!videoConnectionRef.current) {
        return;
      }
      if (!peerConnection) {
        return;
      }

      mediaStream.getTracks().forEach((track) => {
        if (!addedTrackIds.has(track.id)) {
          peerConnection.addTrack(track, mediaStream);
          const newSet = new Set(addedTrackIds);
          newSet.add(track.id);
          setAddedTrackIds(newSet);
        } else {
          toast({
            title: "Call already in progress",
            description:
              "Please end the current call before starting a new one.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      });

      const offer = await createOffer();

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
        if (
          event.candidate &&
          videoConnectionRef.current.state === HubConnectionState.Connected
        ) {
          await sendIceCandidate(recipientId, event.candidate);
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
      toast({
        title: "An error occurred.",
        description: "Failed to start a video call.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const endCall = async () => {
    endConnection();
    if (videoConnectionRef.current.state === HubConnectionState.Connected) {
      console.log("UserId before invoke: ", userId);
      console.log("RecipientId before invoke: ", currentRecipientId);

      try {
        await videoConnectionRef.current.invoke(
          "NotifyCallDeclined",
          userId,
          currentRecipientId
        );
        console.log("Invoked the Decline");
      } catch (error) {
        console.error(
          "Failed to notify the other user that the call has been ended: ",
          error.toString(),
          "Server responded with:",
          error?.serverMessage
        );
      }
    } else {
      console.warn(
        "Couldn't notify the other user that the call has ended because the SignalR connection is not active."
      );
    }
    setIsVideoCallOpen(false);
    initializePeerConnection();
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
  useEffect(() => {
    videoConnectionRef.current = new HubConnectionBuilder()
      .withUrl(`https://localhost:7013/video?access_token=${token}`, {
        accessTokenFactory: () => token,
      })
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

    return () => {
      videoConnectionRef.current.stop().catch((err) => {
        console.log("Error stopping VideoHub connection:", err);
      });
    };
  }, []);

  const handleReceiveCallAnswer = async (callerId, answer, peerConnection) => {
    stopRingingSound();
    console.log("Received answer from callerId: ", callerId);
    if (!peerConnection || peerConnection.signalingState === "closed") {
      console.error("PeerConnection is not yet initialized or is closed.");
      return;
    }
    try {
      const remoteAnswer = new RTCSessionDescription(JSON.parse(answer));
      console.log("Remote answer", remoteAnswer);
      await peerConnection.setRemoteDescription(remoteAnswer);
      console.log("Remote description set successfully for the answer.");
    } catch (err) {
      console.error("Error in handleReceiveCallAnswer: ", err);
    }
  };
  useEffect(() => {
    const handleReceiveDirectCallAnswer = (callerId, answerJson) => {
      console.log("Received answer:", answerJson);
      if (peerConnection) {
        handleReceiveCallAnswer(callerId, answerJson, peerConnection);
      } else {
        console.error("PeerConnection is not initialized");
      }
    };

    videoConnectionRef.current.off("ReceiveDirectCallAnswer");
    videoConnectionRef.current.on(
      "ReceiveDirectCallAnswer",
      handleReceiveDirectCallAnswer
    );

    return () => {
      videoConnectionRef.current.off("ReceiveDirectCallAnswer");
    };
  }, [peerConnection]);

  const handleReceiveIceCandidate = async (
    iceCandidateJson,
    peerConnection
  ) => {
    if (!peerConnection || peerConnection.signalingState === "closed") {
      console.error("PeerConnection is not yet initialized or is closed.");
      return;
    }
    try {
      const iceCandidate = new RTCIceCandidate(JSON.parse(iceCandidateJson));
      await peerConnection.addIceCandidate(iceCandidate);
      console.log("ICE candidate added successfully.");
    } catch (err) {
      console.error("Error in handleReceiveIceCandidate: ", err);
    }
  };

  useEffect(() => {
    const handleReceiveEvent = (iceCandidateJson) => {
      if (peerConnection) {
        handleReceiveIceCandidate(iceCandidateJson, peerConnection);
      } else {
        console.error("PeerConnection is not initialized");
      }
    };

    videoConnectionRef.current.off("ReceiveIceCandidate");
    videoConnectionRef.current.on("ReceiveIceCandidate", handleReceiveEvent);

    return () => {
      videoConnectionRef.current.off("ReceiveIceCandidate");
    };
  }, [peerConnection]);

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
                    onClick={async (e) => {
                      e.stopPropagation();
                      setIsLoadingPeerConnection(true);
                      await handleStartVideoCall(applicant.applicantAppUserId);
                      setIsLoadingPeerConnection(false);
                    }}
                    m={2}
                  />
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setApplicationIdToDelete(applicant.applicationId);
                      setIsDeleteDialogOpen(true);
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

      <Modal isOpen={isOpen} onClose={closeModal} size="2xl">
        <ModalOverlay />
        <ModalContent maxW="800px">
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
              maxHeight="400px"
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
                    maxWidth="70%"
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
              onClick={() => {
                handleSendMessage(
                  inputMessage,
                  userId,
                  currentRecipientId,
                  connectionRef
                );
                setInputMessage("");
              }}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this chat?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => deleteApplication(applicationIdToDelete)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isVideoCallOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalBody>
            <VideoCall
              peerConnection={peerConnection}
              mediaStream={mediaStream}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={endCall}>
              Decline Call
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
