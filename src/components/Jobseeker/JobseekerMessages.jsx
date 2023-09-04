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

export function JobseekerMessages() {
  const toast = useToast();
  const { userId } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [currentRecipientId, setCurrentRecipientId] = useState(null);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [callerId, setCallerId] = useState(null);
  const cancelRef = useRef();
  const callStatus = useSelector((state) => state.call.status);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const {
    mediaStream,
    error: mediaError,
    startMedia,
  } = useUserMedia({
    video: true,
    audio: true,
  });
  console.log("mediaStream after useUserMedia:", mediaStream);

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

  const handleReceiveCallOffer = async (callerId, recipientId, offer) => {
    setIsCallDialogOpen(true);
    setCallerId(callerId);

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
      console.log("Remote offer set successfully.");
    } catch (err) {
      console.error("Error in handleReceiveCallOffer: ", err);
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
  const { peerConnection, localAnswer, createAnswer, addIceCandidate, error } =
    useWebRTC(userId, callerId);

  const { connection } = useSignalRVideo(
    userId,
    handleReceiveCallOffer,
    jobseekerContacts,
    createAnswer
  );

  const handleAccept = async () => {
    setIsCallDialogOpen(false);
    setIsVideoCallOpen(true);

    if (!peerConnection) {
      console.error("WebRTC peer connection is not initialized.");
      showToastError("WebRTC peer connection is not initialized.");
      return;
    }

    console.log(
      "PeerConnection signaling state:",
      peerConnection.signalingState
    );

    if (peerConnection.signalingState !== "have-remote-offer") {
      console.error("PeerConnection is not in 'have-remote-offer' state.");
      showToastError("PeerConnection is not in 'have-remote-offer' state.");
      return;
    }

    if (!peerConnection.remoteDescription) {
      console.error("Remote description is not set. Cannot create answer.");
      showToastError("Remote description is not set. Cannot create answer.");
      return;
    }

    let localStream;
    try {
      localStream = await startMedia();
      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, localStream));
      } else {
        console.warn("Local media stream is not available.");
        return;
      }
    } catch (error) {
      console.error("Error in obtaining local media: ", error);
      showToastError("Error in obtaining local media.");
      return;
    }

    try {
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

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
        console.error("SignalR connection is not available.");
        showToastError("SignalR connection is not available.");
      }
    } catch (error) {
      console.error("Error in handleAccept: ", error);
      showToastError(`Error in handleAccept: ${error.message}`);
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
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isVideoCallOpen && (
              <VideoCall
                setIsVideoCallOpen={setIsVideoCallOpen}
                peerConnection={peerConnection}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
