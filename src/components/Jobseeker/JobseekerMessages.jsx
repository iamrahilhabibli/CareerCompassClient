import React, { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
import * as signalR from "@microsoft/signalr";
import useUser from "../../customhooks/useUser";
import inboxImg from "../../images/inbox.png";
import { addMessage } from "../../reducers/messageSlice";
import { loadInitialMessages } from "../../reducers/messageSlice";
import { useSendMessage } from "../../customhooks/useSendMessage";
import { useSignalRConnection } from "../../customhooks/useSignalRConnection";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useSignalRVideo } from "../../customhooks/useSignalRVideo";
import { VideoCall } from "../Employers/Videocall";
import useWebRTC from "../../customhooks/useWebRTC";
import {
  setAcceptedCall,
  setDeclinedCall,
  setIdle,
} from "../../reducers/callSlice";
import useUserMedia from "../../customhooks/useUserMedia";
import { FaPhoneSlash } from "react-icons/fa";
import { clearIceCandidates } from "../../reducers/iceCandidateSlice";

export function JobseekerMessages() {
  const toast = useToast();
  const { userId, token } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const callStatus = useSelector((state) => state.call.status);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const iceCandidates = useSelector((state) => state.iceCandidate.candidates);

  const {
    mediaStream,
    error: mediaError,
    startMedia,
  } = useUserMedia({
    video: true,
    audio: true,
  });
  const {
    peerConnection,
    createAnswer,
    endConnection,
    error,
    initializePeerConnection,
    addIceCandidate,
  } = useWebRTC(userId, callerId);
  const openChatWithContact = async (contact) => {
    setCurrentRecipientId(contact.recruiterAppUserId);
    setCurrentContact(contact);
    try {
      await connectionRef.current.invoke(
        "JoinGroup",
        userId,
        contact.recruiterAppUserId
      );
      console.log("Joined group.");
      fetch(
        `https://localhost:7013/api/Messages/GetMessages?senderId=${userId}&receiverId=${contact.recruiterAppUserId}`
      )
        .then((response) => response.json())
        .then((data) => {
          dispatch(
            loadInitialMessages({
              recipientId: contact.recruiterAppUserId,
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
  const fetchJobseekerContacts = async () => {
    const { data } = await axios.get(
      `https://localhost:7013/api/JobApplications/GetApprovedPositions/${userId}`
    );
    return data;
  };
  const connectionRef = useSignalRConnection(
    userId,
    currentRecipientId,
    dispatch,
    addMessage
  );
  const handleSendMessage = useSendMessage(toast);

  const handleCallDeclined = () => {
    console.log("handleCallDeclined called");
    endConnection();
    setIsVideoCallOpen(false);
    initializePeerConnection();
  };
  const handleReceiveCallOffer = async (callerId, offer) => {
    setIsCallDialogOpen(true);
    setCallerId(callerId);
    console.log(offer);
    if (!peerConnection) {
      console.error("PeerConnection is not yet initialized.");
      showToastError("PeerConnection is not yet initialized.");
      return;
    }
    if (peerConnection.signalingState === "closed") {
      console.error("PeerConnection signalingState is closed.");
      showToastError("PeerConnection signalingState is closed.");
      return;
    }

    try {
      if (peerConnection.signalingState !== "stable") {
        console.warn(
          `PeerConnection is in an unsuitable state: ${peerConnection.signalingState}`
        );
        return;
      }
      const remoteOffer = new RTCSessionDescription(offer);
      await peerConnection.setRemoteDescription(remoteOffer);
      iceCandidates.forEach(async (candidate) => {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      });
      dispatch(clearIceCandidates());
    } catch (err) {
      showToastError(`Error in handleReceiveCallOffer: ${err.message}`);
    }
  };

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
    data: jobseekerContacts,
    isLoading,
    isError,
  } = useQuery(["jobseekerContacts", userId], fetchJobseekerContacts, {
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
  const { connection } = useSignalRVideo(
    userId,
    handleReceiveCallOffer,
    jobseekerContacts,
    handleCallDeclined,
    token
  );

  const handleAccept = async () => {
    setIsCallDialogOpen(false);
    setIsVideoCallOpen(true);

    const handleError = (message) => {
      showToastError(message);
    };

    if (!peerConnection) {
      handleError("WebRTC peer connection is not initialized.");
      return;
    }

    if (peerConnection.signalingState !== "have-remote-offer") {
      handleError("PeerConnection is not in 'have-remote-offer' state.");
      return;
    }

    if (!peerConnection.remoteDescription) {
      handleError("Remote description is not set. Cannot create answer.");
      return;
    }

    try {
      const localStream = await startMedia();
      if (!localStream) {
        return;
      }

      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      setupIceCandidateHandling(callerId);

      if (
        connection &&
        connection.state === signalR.HubConnectionState.Connected
      ) {
        await connection.invoke(
          "AnswerDirectCallAsync",
          callerId,
          JSON.stringify(answer)
        );
      } else {
        handleError("SignalR connection is not available.");
      }
    } catch (error) {
      handleError(`Error in handleAccept: ${error.message}`);
    }
  };

  const setupIceCandidateHandling = (recipientId) => {
    if (!peerConnection) {
      console.error("Peer connection is not initialized.");
      return;
    }

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated by callee:", event.candidate);
        if (
          connection &&
          connection.state === signalR.HubConnectionState.Connected
        ) {
          await sendIceCandidateToCaller(recipientId, event.candidate);
        }
      }
    };
  };

  const sendIceCandidateToCaller = async (recipientId, candidate) => {
    try {
      console.log("Callee is invoking SendIceCandidate");
      await connection.invoke(
        "SendIceCandidate",
        recipientId,
        JSON.stringify(candidate)
      );
    } catch (error) {
      console.log("Error sending ICE candidate from callee:", error);
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

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100%"
      >
        <Spinner size="xl" />{" "}
      </Box>
    );
  }

  if (isError) {
    toast({
      title: "An error occurred.",
      description: "Unable to load contacts.",
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top-right",
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
      {console.log(messages)}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>
            {currentContact
              ? `${currentContact.firstName} ${currentContact.lastName}`
              : ""}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Box p={2} fontStyle="italic" fontSize="sm" color="red.600">
              Your chat history will only remain for 3 days.
            </Box>
            <Box
              flex="1"
              bg="gray.100"
              border="1px"
              height={"400px"}
              maxHeight="400px"
              overflowY="auto"
            >
              {[...(messages[currentRecipientId] || [])]
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((message, index) => (
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
        isOpen={isCallDialogOpen}
        onClose={() => setIsCallDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Incoming Call
            </AlertDialogHeader>
            <AlertDialogBody>
              {`You have an incoming call from ${callerId}. Do you want to accept?`}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                onClick={() => {
                  setIsCallDialogOpen(false);
                  dispatch(setDeclinedCall());
                }}
              >
                Decline
              </Button>
              <Button
                colorScheme="green"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept();
                }}
              >
                Accept
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)}>
        <ModalOverlay />
        <ModalContent maxWidth="80%">
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isVideoCallOpen && (
              <VideoCall
                setIsVideoCallOpen={setIsVideoCallOpen}
                peerConnection={peerConnection}
                mediaStream={mediaStream}
              />
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="red"
              variant="solid"
              // onClick={endCall}
              leftIcon={<FaPhoneSlash color="white" />}
            ></Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
