import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Flex, useToast } from "@chakra-ui/react";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);
  const [focusedVideo, setFocusedVideo] = useState("remote");
  const toast = useToast();

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
  }, [error, toast]);

  useEffect(() => {
    if (!mediaStream) {
      // setError("No media stream available.");
    } else if (localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
    }

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (peerConnection) {
      const handleTrackEvent = (event) => {
        if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.ontrack = handleTrackEvent;

      return () => {
        peerConnection.ontrack = null;
      };
    } else {
      // setError("No peer connection available.");
    }
  }, [peerConnection]);

  return (
    <Flex
      className="video-call-wrapper"
      height="100%"
      maxWidth={"100%"}
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
      ></Box>
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
      ></Box>
    </Flex>
  );
}

VideoCall.propTypes = {
  setIsVideoCallOpen: PropTypes.func.isRequired,
  peerConnection: PropTypes.object,
  mediaStream: PropTypes.object,
};
