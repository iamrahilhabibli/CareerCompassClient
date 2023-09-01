import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

export function VideoCall({ setIsVideoCallOpen, peerConnection }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Assuming you handle peer connections elsewhere and are passing them down as props.
    if (peerConnection) {
      // Attach your local and remote video streams to the video tags
      // This would generally be done where you handle your WebRTC logic
      // Here's a skeleton code to give you an idea
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    }
  }, [peerConnection]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
      }}
    >
      <button onClick={() => setIsVideoCallOpen(false)}>Close</button>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: "50%", height: "50%" }}
      ></video>
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{ width: "50%", height: "50%" }}
      ></video>
    </div>
  );
}
