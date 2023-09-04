import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Media Stream in useEffect: ", mediaStream);

    if (!mediaStream) {
      setError("No media stream available.");
    } else if (localVideoRef.current) {
      console.log("Assigning local media stream.");
      localVideoRef.current.srcObject = mediaStream;
    }

    return () => {
      console.log("Cleaning up media stream.");
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (peerConnection) {
      const handleTrackEvent = (event) => {
        if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          console.log("Assigning remote media stream.");
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.ontrack = handleTrackEvent;

      return () => {
        console.log("Cleaning up ontrack event.");
        peerConnection.ontrack = null;
      };
    } else {
      setError("No peer connection available.");
    }
  }, [peerConnection]);

  return (
    <div className="video-call-wrapper">
      {error && <div className="error">{error}</div>}
      <button onClick={() => setIsVideoCallOpen(false)}>Close</button>
      <video ref={localVideoRef} autoPlay muted className="local-video"></video>
      <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
    </div>
  );
}

VideoCall.propTypes = {
  setIsVideoCallOpen: PropTypes.func.isRequired,
  peerConnection: PropTypes.object,
  mediaStream: PropTypes.object,
};
