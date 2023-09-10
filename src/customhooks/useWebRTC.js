import { useState, useEffect } from "react";

const useWebRTC = (userId, applicantAppUserId, videoConnectionRef) => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);

  // const addIceCandidate = (candidateJson) => {
  //   if (!peerConnection) {
  //     console.error(
  //       "PeerConnection is not initialized, can't add ICE candidate"
  //     );
  //     return;
  //   }
  //   const candidate = new RTCIceCandidate(JSON.parse(candidateJson));
  //   peerConnection.addIceCandidate(candidate).catch((e) => {
  //     console.error(`Failed to add ICE candidate: ${e.toString()}`);
  //   });
  // };

  const addIceCandidate = (candidateJson) => {
    return new Promise((resolve, reject) => {
      if (!peerConnection) {
        reject("PeerConnection is not initialized, can't add ICE candidate");
        return;
      }
      const candidate = new RTCIceCandidate(JSON.parse(candidateJson));
      peerConnection
        .addIceCandidate(candidate)
        .then(resolve)
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
  }, [userId, applicantAppUserId, videoConnectionRef]);

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
  };
};

export default useWebRTC;
