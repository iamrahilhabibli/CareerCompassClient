import { useState, useEffect } from "react";

const useWebRTC = (userId, applicantAppUserId, videoConnectionRef) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("event.candidate is available:", event.candidate);
        if (videoConnectionRef && videoConnectionRef.current) {
          console.log(
            "videoConnectionRef.current is available:",
            videoConnectionRef.current
          );
          try {
            await videoConnectionRef.current.invoke(
              "SendIceCandidate",
              applicantAppUserId,
              JSON.stringify(event.candidate)
            );
            console.log("ICE candidate successfully sent to the server.");
          } catch (error) {
            console.error("Error sending ICE candidate: ", error);
          }
        } else {
          console.warn(
            "videoConnectionRef.current is not available or is null"
          );
        }
      } else {
        console.warn("event.candidate is null");
      }
    };

    setPeerConnection(pc);

    return () => {
      isMounted = false;
      if (isMounted && pc) {
        pc.close();
      }
    };
  }, [userId, applicantAppUserId, videoConnectionRef]);

  const createOffer = async () => {
    setError(null);

    if (!peerConnection) {
      setError("Peer connection is not initialized.");
      return null;
    }

    try {
      const offer = await peerConnection.createOffer();
      if (!offer) {
        setError("Offer is null or undefined.");
        return null;
      }
      await peerConnection.setLocalDescription(offer);
      return offer;
    } catch (e) {
      setError(`Failed to create an offer: ${e}`);
      return null;
    }
  };

  return {
    peerConnection,
    createOffer,
    error,
  };
};

export default useWebRTC;
