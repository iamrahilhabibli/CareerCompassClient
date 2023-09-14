import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);
  const [focusedVideo, setFocusedVideo] = useState("remote");

  useEffect(() => {
    if (!mediaStream) {
      console.log("Error: No media stream available."); // Debug line
      setError("No media stream available.");
    } else if (localVideoRef.current) {
      console.log("Setting local media stream."); // Debug line
      localVideoRef.current.srcObject = mediaStream;
    }

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (peerConnection) {
      console.log("Peer connection available."); // Debug line

      const handleTrackEvent = (event) => {
        console.log("Received track event:", event); // Debug line

        if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          console.log("Setting remote media stream."); // Debug line
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.ontrack = handleTrackEvent;

      return () => {
        peerConnection.ontrack = null;
      };
    } else {
      console.log("Error: No peer connection available."); // Debug line
      setError("No peer connection available.");
    }
  }, [peerConnection]);

  return (
    <div className="video-call-wrapper">
      {error && <div className="error">{error}</div>}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className={`video ${
          focusedVideo === "local" ? "focused" : ""
        } local-video`}
        onClick={() =>
          setFocusedVideo(focusedVideo === "local" ? "remote" : "local")
        }
      ></video>
      <video
        ref={remoteVideoRef}
        autoPlay
        className={`video ${
          focusedVideo === "remote" ? "focused" : ""
        } remote-video`}
        onClick={() =>
          setFocusedVideo(focusedVideo === "remote" ? "local" : "remote")
        }
      ></video>

      <style>{`
        .video-call-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
        }
        .video {
          flex: 1;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin: 1rem;
          object-fit: cover;
          transition: flex 0.3s ease-in-out;
        }
        .focused {
          flex: 2;
        }
        .local-video {
          // Additional styling specific to local video, if any
        }
        .remote-video {
          // Additional styling specific to remote video, if any
        }
        .error {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: red;
          color: white;
          padding: 0.5rem;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}

VideoCall.propTypes = {
  setIsVideoCallOpen: PropTypes.func.isRequired,
  peerConnection: PropTypes.object,
  mediaStream: PropTypes.object,
};
