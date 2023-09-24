import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Flex, useToast } from "@chakra-ui/react";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);
  const [focusedVideo, setFocusedVideo] = useState("remote");
  const toast = useToast();

  const handleError = (message) => {
    setError(message);
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "An error occurred.",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error]);

  useEffect(() => {
    if (mediaStream && localVideoRef.current) {
      console.log("Media stream tracks: ", mediaStream.getTracks());

      localVideoRef.current.srcObject = mediaStream;
    } else if (!mediaStream) {
      console.log("Media stream does not exist");
      // handleError("No media stream available.");
    }

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (peerConnection) {
      console.log("PeerConnection State: ", peerConnection.connectionState);
      console.log(
        "PeerConnection IceConnectionState: ",
        peerConnection.iceConnectionState
      );

      const handleTrackEvent = (event) => {
        console.log("Event tracks: ", event.streams[0].getTracks());
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const handleIceConnectionStateChange = () => {
        console.log(
          "ICE Connection State Change:",
          peerConnection.iceConnectionState
        );
      };

      const handleIceCandidate = (event) => {
        if (event.candidate) {
          console.log("ICE candidate:", event.candidate);
        }
      };

      const handleNegotiationNeeded = async () => {
        console.log("Negotiation needed");
      };

      const handleConnectionStateChange = () => {
        console.log("Connection State Change:", peerConnection.connectionState);
      };
      peerConnection.ontrack = handleTrackEvent;
      peerConnection.oniceconnectionstatechange =
        handleIceConnectionStateChange;
      peerConnection.onicecandidate = handleIceCandidate;
      peerConnection.onnegotiationneeded = handleNegotiationNeeded;
      peerConnection.onconnectionstatechange = handleConnectionStateChange;

      return () => {
        peerConnection.ontrack = null;
        peerConnection.oniceconnectionstatechange = null;
        peerConnection.onicecandidate = null;
        peerConnection.onnegotiationneeded = null;
        peerConnection.onconnectionstatechange = null;
      };
    } else {
      // handleError("No peer connection available.");
    }
  }, [peerConnection]);

  return (
    <Flex
      className="video-call-wrapper"
      height="100%"
      maxWidth="100%"
      borderRadius="15px"
      justify="space-between"
      overflow="hidden"
      align="center"
    >
      {error && (
        <Box
          position="absolute"
          top={0}
          left="50%"
          color="white"
          bg="red.500"
          borderRadius="md"
          p={2}
        >
          {error}
        </Box>
      )}
      <Box
        as="video"
        ref={localVideoRef}
        autoPlay
        muted
        maxWidth="48%"
        maxHeight="100%"
        flex={focusedVideo === "local" ? 2 : 1}
        borderRadius="10px"
        boxShadow="md"
        m={4}
        objectFit="cover"
        onClick={() =>
          setFocusedVideo(focusedVideo === "local" ? "remote" : "local")
        }
      />
      <Box
        as="video"
        ref={remoteVideoRef}
        autoPlay
        maxWidth="48%"
        maxHeight="100%"
        flex={focusedVideo === "remote" ? 2 : 1}
        borderRadius="10px"
        boxShadow="md"
        m={4}
        objectFit="cover"
        onClick={() =>
          setFocusedVideo(focusedVideo === "remote" ? "local" : "remote")
        }
      />
    </Flex>
  );
}

VideoCall.propTypes = {
  setIsVideoCallOpen: PropTypes.func.isRequired,
  peerConnection: PropTypes.object,
  mediaStream: PropTypes.object,
};
