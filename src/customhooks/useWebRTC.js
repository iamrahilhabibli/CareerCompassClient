import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getDb } from "../configurations/firebaseConfig";

const db = getDb();

const useWebRTC = (userId, applicantAppUserId) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const listenForRemoteSDP = async () => {
      const callDoc = doc(db, "calls", `${userId}-${applicantAppUserId}`);
      onSnapshot(callDoc, async (snapshot) => {
        const data = snapshot.data();
        if (peerConnection.signalingState !== "stable" && data?.answer) {
          const remoteOffer = new RTCSessionDescription(data.answer);
          await peerConnection.setRemoteDescription(remoteOffer);
        }
      });
    };

    listenForRemoteSDP().catch((err) =>
      console.error("An error occurred:", err)
    );

    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const callDoc = doc(db, "calls", `${userId}-${applicantAppUserId}`);
        const candidatesCollection = collection(callDoc, "candidates");
        await addDoc(candidatesCollection, event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      // TODO: Handle remote media stream, you'll likely assign this to some React state.
    };

    setPeerConnection(pc);
  }, [userId, applicantAppUserId]);

  const createOffer = async () => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const callDoc = doc(db, "calls", `${userId}-${applicantAppUserId}`);
      await setDoc(callDoc, { offer: offer.toJSON() }, { merge: true });
    } catch (e) {
      setError(`Failed to create an offer: ${e.toString()}`);
    }
  };

  const createAnswer = async () => {
    try {
      const offer = peerConnection.remoteDescription;
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      const callDoc = doc(db, "calls", `${userId}-${applicantAppUserId}`);
      await updateDoc(callDoc, { answer: answer.toJSON() });
    } catch (e) {
      setError(`Failed to create an answer: ${e.toString()}`);
    }
  };

  const addIceCandidate = async (candidate) => {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      setError(`Failed to add ICE candidate: ${e.toString()}`);
    }
  };

  const listenForRemoteICECandidate = () => {
    const callDoc = doc(db, "calls", `${userId}-${applicantAppUserId}`);
    const candidatesCollection = collection(callDoc, "candidates");

    onSnapshot(candidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate).catch((e) => {
            setError(`Failed to add ICE candidate: ${e.toString()}`);
          });
        }
      });
    });
  };

  useEffect(() => {
    if (peerConnection) {
      listenForRemoteICECandidate();
    }
  }, [peerConnection]);

  return {
    peerConnection,
    createOffer,
    createAnswer,
    addIceCandidate,
    error,
  };
};

export default useWebRTC;
