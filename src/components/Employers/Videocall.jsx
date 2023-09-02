import React, { useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import useUserMedia from "../../customhooks/useUserMedia";

export function VideoCall({ setIsVideoCallOpen, peerConnection }) {
  console.log("VideoCall component is rendering");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const constraints = useMemo(() => {
    return { video: true, audio: true };
  }, []);

  const { mediaStream, error: mediaError } = useUserMedia(constraints);

  useEffect(() => {
    if (mediaStream && localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
    }

    if (mediaError) {
      console.log("Media error:", mediaError);
    }

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream, mediaError]);

  useEffect(() => {
    console.log("Second useEffect for peerConnection triggered"); // Log useEffect runs
    if (peerConnection) {
      console.log("Setting up peer connection"); // Log the setting of the peer connection

      const handleTrackEvent = (event) => {
        console.log("Handling track event"); // Log when track events are being handled
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.ontrack = handleTrackEvent;

      return () => {
        console.log("Cleaning up peer connection"); // Log clean-up steps
        peerConnection.ontrack = null;
      };
    }
  }, [peerConnection]);

  return (
    <div className="video-call-wrapper">
      <button
        onClick={() => {
          console.log("Close button clicked");
          setIsVideoCallOpen(false);
        }}
      >
        Close
      </button>
      <video ref={localVideoRef} autoPlay muted className="local-video"></video>
      <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
    </div>
  );
}

// VideoCall.propTypes = {
//   setIsVideoCallOpen: PropTypes.func.isRequired,
//   peerConnection: PropTypes.object,
// };
