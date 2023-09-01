import { useState, useEffect } from "react";
import { db } from "../configurations/firebaseConfig";

const useWebRTC = (userId, applicantAppUserId) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listenForRemoteSDP().catch((err) =>
      console.error("An error occurred:", err)
    );
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const callDoc = db
          .collection("calls")
          .doc(`${userId}-${applicantAppUserId}`);
        const candidatesCollection = callDoc.collection("candidates");
        await candidatesCollection.add(event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      // TODO: Handle remote media stream, you'll likely assign this to some React state.
    };

    setPeerConnection(pc);
  }, [userId, applicantAppUserId, db]);

  const createOffer = async () => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      const callDoc = db
        .collection("calls")
        .doc(`${userId}-${applicantAppUserId}`);
      await callDoc.set({ offer: offer.toJSON() }, { merge: true });
    } catch (e) {
      setError(`Failed to create an offer: ${e.toString()}`);
    }
  };

  const createAnswer = async () => {
    try {
      const offer = peerConnection.remoteDescription;
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      const callDoc = db
        .collection("calls")
        .doc(`${userId}-${applicantAppUserId}`);
      await callDoc.update({ answer: answer.toJSON() });
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

  const createNewCall = async () => {
    try {
      // You can add logic here to initialize a new call.
      // Maybe creating a Firestore doc or something else.
    } catch (e) {
      setError(`Failed to create new call: ${e.toString()}`);
    }
  };

  const listenForRemoteICECandidate = () => {
    const callDoc = db
      .collection("calls")
      .doc(`${userId}-${applicantAppUserId}`);
    const candidatesCollection = callDoc.collection("candidates");

    candidatesCollection.onSnapshot((snapshot) => {
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

  const listenForRemoteSDP = async () => {
    const callDoc = db
      .collection("calls")
      .doc(`${userId}-${applicantAppUserId}`);

    callDoc.onSnapshot(async (snapshot) => {
      const data = snapshot.data();
      if (peerConnection.signalingState !== "stable" && data && data.answer) {
        const remoteOffer = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(remoteOffer);
      }
    });
  };
  useEffect(() => {
    if (peerConnection) {
      listenForRemoteICECandidate();
      listenForRemoteSDP();
    }
  }, [peerConnection]);

  return {
    peerConnection,
    createOffer,
    createAnswer,
    addIceCandidate,
    createNewCall,
    error,
  };
};

export default useWebRTC;
