import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

export function VideoCall({ setIsVideoCallOpen, peerConnection, mediaStream }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Effect for handling mediaStream is running.");
    if (mediaStream && localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
    }

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    console.log("Effect for handling peerConnection is running.");
    if (peerConnection && mediaStream) {
      const handleTrackEvent = (event) => {
        console.log("handleTrackEvent is being called.");
        if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // This should ensure tracks are added only when the connection is ready.
      if (peerConnection.signalingState === "stable") {
        mediaStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, mediaStream);
        });
      }
      peerConnection.ontrack = handleTrackEvent;

      return () => {
        peerConnection.ontrack = null;
      };
    }
  }, [peerConnection, mediaStream]);

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
