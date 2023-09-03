import React, { useRef, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import useUserMedia from "../../customhooks/useUserMedia";

export function VideoCall({ setIsVideoCallOpen, peerConnection }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);

  const constraints = useMemo(() => {
    return { video: true, audio: true };
  }, []);

  const { mediaStream, error: mediaError } = useUserMedia(constraints);

  useEffect(() => {
    if (mediaStream && localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
    }

    if (mediaError) {
      console.error("Media error:", mediaError);
      setError(mediaError);
    }

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream, mediaError]);

  useEffect(() => {
    if (peerConnection && mediaStream) {
      if (
        ["stable", "have-local-offer", "have-remote-offer"].includes(
          peerConnection.signalingState
        )
      ) {
        mediaStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, mediaStream);
        });
      }

      const handleTrackEvent = (event) => {
        if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.ontrack = handleTrackEvent;

      return () => {
        peerConnection.ontrack = null;

        // Stopping tracks and closing the peer connection may not be ideal here depending on your use-case
        // peerConnection.getSenders().forEach((sender) => sender.track.stop());
        // peerConnection.close();
      };
    }
  }, [peerConnection, mediaStream]);

  return (
    <div className="video-call-wrapper">
      {error && <div className="error">{error}</div>}
      <button
        onClick={() => {
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

VideoCall.propTypes = {
  setIsVideoCallOpen: PropTypes.func.isRequired,
  peerConnection: PropTypes.object,
};
