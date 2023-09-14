import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIceCandidate,
  setRemoteDescription,
  flushIceCandidateQueue,
} from "../reducers/webRtcSlice";
const useWebRTC = (userId, applicantAppUserId) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);
  const [videoConnectionRef, setVideoConnectionRef] = useState(null);
  const dispatch = useDispatch();
  const remoteDescriptionSet = useSelector(
    (state) => state.webRTC.remoteDescriptionSet
  );

  const iceCandidateQueue = useSelector(
    (state) => state.webRTC.iceCandidateQueue
  );
  const updateRemoteDescriptionSet = (value) => {
    dispatch(setRemoteDescription(value));
    if (value) {
      flushIceCandidateQueue();
    }
  };

  const flushIceCandidateQueue = () => {
    iceCandidateQueue.forEach((candidateJson) => {
      addIceCandidate(candidateJson);
    });
    dispatch(flushIceCandidateQueue());
  };
  const handleAddIceCandidate = (candidateJson) => {
    return new Promise((resolve, reject) => {
      if (!remoteDescriptionSet) {
        dispatch(addIceCandidate(candidateJson));
        reject("Remote description not set.");
        return;
      }

      if (!peerConnection) {
        reject("PeerConnection is not initialized, can't add ICE candidate");
        return;
      }

      let candidate;
      try {
        candidate = new RTCIceCandidate(
          typeof candidateJson === "string"
            ? JSON.parse(candidateJson)
            : candidateJson
        );
      } catch (e) {
        reject(`Error parsing ICE candidate JSON: ${e.toString()}`);
        return;
      }

      peerConnection
        .addIceCandidate(candidate)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(`Failed to add ICE candidate: ${e.toString()}`);
        });
    });
  };

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);
    pc.debugId = Math.random().toString();

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
    handleAddIceCandidate,
  };
};

export default useWebRTC;
