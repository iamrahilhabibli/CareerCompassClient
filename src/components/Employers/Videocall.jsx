import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mediaStream) {
      setError("No media stream available.");
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
      setError("No peer connection available.");
    }
  }, [peerConnection]);

  return (
    <div className="video-call-wrapper">
      {error && <div className="error">{error}</div>}
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
