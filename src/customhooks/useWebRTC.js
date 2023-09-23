import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const useWebRTC = (userId, applicantAppUserId) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);
  const videoConnectionRef = useRef(null);
  const dispatch = useDispatch();

  const addIceCandidate = async (candidate) => {
    if (!peerConnection) {
      console.error(
        "PeerConnection is not initialized. Cannot add ICE candidate."
      );
      return;
    }
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error(`Failed to add ICE candidate: ${error}`);
    }
  };

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        if (videoConnectionRef.current) {
          try {
            await videoConnectionRef.current.invoke(
              "SendIceCandidate",
              applicantAppUserId,
              JSON.stringify(event.candidate)
            );
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

    pc.ontrack = (event) => {
      console.log("Received remote track", event.track);
      // Here, you'd typically attach this track to a <video> or <audio> HTML element
    };

    setPeerConnection(pc);
  };

  useEffect(() => {
    initializePeerConnection();
    return () => {
      endConnection();
    };
  }, []);

  const createOffer = async () => {
    setError(null);
    if (!peerConnection) {
      setError("Peer connection is not initialized.");
      return null;
    }

    try {
      const offer = await peerConnection.createOffer();
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
      await peerConnection.setLocalDescription(answer);
      return answer;
    } catch (e) {
      setError(`Failed to create an answer: ${e}`);
      return null;
    }
  };

  const endConnection = () => {
    console.log("EndConnection called");

    if (peerConnection) {
      const senders = peerConnection.getSenders();
      senders.forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
        peerConnection.removeTrack(sender);
      });
      peerConnection.close();
    }
    setPeerConnection(null);
  };

  return {
    peerConnection,
    createOffer,
    createAnswer,
    endConnection,
    error,
    initializePeerConnection,
    addIceCandidate,
  };
};

export default useWebRTC;
