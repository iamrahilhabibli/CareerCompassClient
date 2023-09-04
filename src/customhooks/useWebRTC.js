import { useState, useEffect } from "react";

const useWebRTC = (userId, applicantAppUserId, videoConnectionRef) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let pc = null;

    if (userId !== null && applicantAppUserId !== null) {
      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };
      console.log(`Hook dependencies: ${userId}, ${applicantAppUserId}`);

      pc = new RTCPeerConnection(configuration);
      pc.debugId = Math.random().toString();
      console.log(`New PeerConnection created with debugId: ${pc.debugId}`);

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          console.log("event.candidate is available:", event.candidate);
          if (videoConnectionRef && videoConnectionRef.current) {
            console.log(
              "videoConnectionRef.current is available:",
              videoConnectionRef.current
            );
            try {
              console.log("Invoking SendIceCanditate in useWebRTC");
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
    } else {
      console.log(
        "One or both necessary values are null. Skipping PeerConnection initialization."
      );
    }

    return () => {
      isMounted = false;
      if (pc) {
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
  const createAnswer = async (offer) => {
    setError(null);

    if (!peerConnection) {
      setError("Peer connection is not initialized.");
      return null;
    }

    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();

      if (!answer) {
        setError("Answer is null or undefined.");
        return null;
      }
      await peerConnection.setLocalDescription(answer);

      return answer;
    } catch (e) {
      setError(`Failed to create an answer: ${e}`);
      return null;
    }
  };

  return {
    peerConnection,
    createOffer,
    createAnswer,
    error,
  };
};

export default useWebRTC;
