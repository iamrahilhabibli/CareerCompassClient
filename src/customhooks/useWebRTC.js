import { useState, useEffect } from "react";
import { db } from "../configurations/firebaseConfig";

const useWebRTC = (userId, applicantAppUserId) => {
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // TODO: Send this candidate to the other peer via Firebase
      }
    };

    pc.ontrack = (event) => {
      // TODO: Handle remote media stream
    };

    setPeerConnection(pc);
  }, []);

  const createOffer = async () => {
    try {
      if (!peerConnection) throw new Error("Peer Connection not initialized");
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error("Error creating offer: ", error);
    }
  };

  const createAnswer = async () => {
    try {
      if (!peerConnection) throw new Error("Peer Connection not initialized");
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error("Error creating answer: ", error);
    }
  };

  const addIceCandidate = (candidate) => {
    try {
      if (!peerConnection) throw new Error("Peer Connection not initialized");
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate: ", error);
    }
  };

  const createNewCall = async (offer) => {
    try {
      const callDoc = db.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      await callDoc.set({
        offer,
        userId,
        applicantAppUserId,
      });
      // TODO: Listen for answer and candidates here

      return { callDoc, offerCandidates, answerCandidates };
    } catch (error) {
      console.error("Error creating new call: ", error);
    }
  };

  return {
    peerConnection,
    createOffer,
    createAnswer,
    addIceCandidate,
    createNewCall,
  };
};

export default useWebRTC;
