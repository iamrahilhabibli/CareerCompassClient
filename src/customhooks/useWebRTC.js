import { useState, useEffect, useRef } from "react";

const useWebRTC = (userId, applicantAppUserId) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);
  const iceCandidateQueue = useRef([]);
  const [videoConnectionRef, setVideoConnectionRef] = useState(null);
  const [remoteDescriptionSet, setRemoteDescriptionSet] = useState(false);

  const updateRemoteDescriptionSet = (value) => {
    setRemoteDescriptionSet(value);
  };
  const flushIceCandidateQueue = () => {
    iceCandidateQueue.current.forEach((candidateJson) => {
      addIceCandidate(candidateJson);
    });
    iceCandidateQueue.current = [];
  };
  const addIceCandidate = (candidateJson) => {
    console.log(
      "remote description set in addIceCandidate",
      remoteDescriptionSet
    );
    if (!remoteDescriptionSet) {
      console.log(
        "Queueing ICE candidate as remote description is not set yet."
      );
      iceCandidateQueue.current.push(candidateJson);
      return;
    }
    return new Promise((resolve, reject) => {
      if (!peerConnection) {
        reject("PeerConnection is not initialized, can't add ICE candidate");
        return;
      }
      let candidate;
      if (typeof candidateJson === "string") {
        try {
          candidate = new RTCIceCandidate(JSON.parse(candidateJson));
        } catch (e) {
          reject(`Error parsing ICE candidate JSON: ${e.toString()}`);
          return;
        }
      } else if (typeof candidateJson === "object") {
        candidate = new RTCIceCandidate(candidateJson);
      } else {
        reject("Unknown candidateJson type");
        return;
      }

      peerConnection
        .addIceCandidate(candidate)
        .then(resolve)
        .catch((e) => {
          reject(`Failed to add ICE candidate: ${e.toString()}`);
        });
    });
  };

  const initializePeerConnection = () => {
    console.log("Initializing PeerConnection");

    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);
    pc.debugId = Math.random().toString();
    console.log(`New PeerConnection created with debugId: ${pc.debugId}`);

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log("ICE candidate generated:", event.candidate);
        if (videoConnectionRef && videoConnectionRef.current) {
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
    console.log("Endconnection called");
    if (peerConnection) {
      peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
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
    updateRemoteDescriptionSet,
    flushIceCandidateQueue,
  };
};

export default useWebRTC;
