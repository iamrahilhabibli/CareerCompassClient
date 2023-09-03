import { useState, useEffect, useRef } from "react";
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

const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

const listenForRemoteSDP = async (pc, callDocRef, isMounted) => {
  onSnapshot(callDocRef, async (snapshot) => {
    const data = snapshot.data();
    if (isMounted.current && pc && data?.answer) {
      console.log("Setting remote description: ", data.answer);
      try {
        const remoteOffer = new RTCSessionDescription(data.answer);
        await pc.setRemoteDescription(remoteOffer);
      } catch (error) {
        console.error("Failed to set remote description: ", error);
      }
    }
  });
};

const useWebRTC = (userId, applicantAppUserId, callerId) => {
  const [localAnswer, setLocalAnswer] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);
    const callDocRef = doc(db, "calls", `${userId}-${applicantAppUserId}`);

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const candidatesCollection = collection(callDocRef, "candidates");
        await addDoc(candidatesCollection, event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      // TODO: Handle remote media stream.
    };

    listenForRemoteSDP(pc, callDocRef, isMounted).catch((err) => {
      console.error("An error occurred:", err);
    });

    setPeerConnection(pc);

    return () => {
      isMounted.current = false;
      if (pc) {
        pc.close();
      }
    };
  }, [userId, applicantAppUserId, callerId]);

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

      const callDoc = doc(db, "calls", `${userId}-${applicantAppUserId}`);
      await setDoc(callDoc, { offer: offer.toJSON() }, { merge: true });

      return offer;
    } catch (e) {
      setError(`Failed to create an offer: ${e}`);
      return null;
    }
  };

  const createAnswer = async () => {
    console.log("Inside createAnswer...");
    if (!peerConnection) {
      console.log("Peer connection is not initialized.");
      return;
    }
    try {
      const offer = peerConnection.remoteDescription;
      if (!offer) {
        console.log("Remote description is not set.");
        return;
      }
      const answer = await peerConnection.createAnswer();
      console.log("Answer created: ", answer);
      await peerConnection.setLocalDescription(answer);

      const callDoc = doc(db, "calls", `${callerId}-${userId}`);
      await updateDoc(callDoc, { answer: answer.toJSON() });

      setLocalAnswer(answer);
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
    localAnswer,
    error,
  };
};

export default useWebRTC;
