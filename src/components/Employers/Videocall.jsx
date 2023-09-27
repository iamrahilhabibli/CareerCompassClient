import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Flex, useToast } from "@chakra-ui/react";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);
  const [focusedVideo, setFocusedVideo] = useState("remote");
  const toast = useToast();
  const [isLocalVideoLoaded, setLocalVideoLoaded] = useState(false);
  const [isRemoteVideoLoaded, setRemoteVideoLoaded] = useState(false);

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
    if (localVideoRef.current) {
      localVideoRef.current.addEventListener("loadedmetadata", () => {
        setLocalVideoLoaded(true);
      });
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.addEventListener("loadedmetadata", () => {
        setRemoteVideoLoaded(true);
      });
    }

    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.removeEventListener("loadedmetadata", () => {});
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.removeEventListener("loadedmetadata", () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (mediaStream && localVideoRef.current) {
      console.log("Media stream tracks: ", mediaStream.getTracks());

      localVideoRef.current.srcObject = mediaStream;
    } else if (!mediaStream) {
      console.log("Media stream does not exist");
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
        maxHeight="100%"
        borderRadius="10px"
        boxShadow="md"
        m={4}
        objectFit="cover"
        display={isLocalVideoLoaded ? "block" : "none"}
        flex={isRemoteVideoLoaded ? (focusedVideo === "local" ? 2 : 1) : 1}
        onClick={() =>
          setFocusedVideo(focusedVideo === "local" ? "remote" : "local")
        }
      />
      <Box
        as="video"
        ref={remoteVideoRef}
        autoPlay
        maxHeight="100%"
        borderRadius="10px"
        boxShadow="md"
        m={4}
        objectFit="cover"
        display={isRemoteVideoLoaded ? "block" : "none"}
        flex={isLocalVideoLoaded ? (focusedVideo === "remote" ? 2 : 1) : 1}
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
