import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

const startConnection = async (connection) => {
  if (connection.state === HubConnectionState.Connected) {
    console.log("SignalR Connection is already connected.");
    return;
  }

  if (connection.state !== HubConnectionState.Disconnected) {
    throw new Error("Connection is not in a 'Disconnected' state");
  }

  await connection.start();
  console.log("SignalR Connection successfully started for VIDEO");
};

const setupCallReception = (
  connection,
  userId,
  handleReceiveCallOffer,
  addIceCandidate
) => {
  connection.on(
    "ReceiveDirectCall",
    async (callerId, recipientId, offerJson) => {
      console.log("RECEIVEDIRECT CALL!");
      if (userId === recipientId) {
        const offer = JSON.parse(offerJson);
        handleReceiveCallOffer(callerId, recipientId, offer);
      }
    }
  );

  connection.on("ReceiveIceCandidate", (iceCandidateJson) => {
    try {
      const iceCandidate = JSON.parse(iceCandidateJson);
      addIceCandidate(new RTCIceCandidate(iceCandidate));
    } catch (error) {
      console.error("Error handling received ICE candidate:", error);
    }
  });
};

const joinGroups = (connection, userId, jobseekerContacts) => {
  console.log("Attempting to join groups...");
  console.log(`Connection State: ${connection.state}`);
  console.log(jobseekerContacts);

  if (jobseekerContacts && jobseekerContacts.length > 0) {
    if (connection.state === HubConnectionState.Connected) {
      console.log("Connecting to groups");

      jobseekerContacts.forEach((contact) => {
        console.log(
          `Attempting to join group with contact: ${contact.recruiterAppUserId}`
        );

        connection
          .invoke("JoinGroup", userId, contact.recruiterAppUserId)
          .then(() => {
            console.log(
              `Successfully joined group with ${contact.recruiterAppUserId}`
            );
          })
          .catch((err) => {
            console.error(
              `Error joining the group with ${contact.recruiterAppUserId}:`,
              err
            );
          });
      });
    } else {
      console.warn("SignalR Connection is not ready for joining groups.");
    }
  }
};

export const useSignalRVideo = (
  userId,
  handleReceiveCallOffer,
  jobseekerContacts,
  createAnswer,
  addIceCandidate,
  token
) => {
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7013/video", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect([0, 1000, 5000, 10000])
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      startConnection(connection)
        .then(() => {
          setIsConnected(true);
        })
        .catch((err) => console.error(err));
    }
  }, [connection]);

  useEffect(() => {
    if (isConnected && jobseekerContacts && jobseekerContacts.length > 0) {
      joinGroups(connection, userId, jobseekerContacts);
    }
  }, [isConnected, jobseekerContacts]);

  useEffect(() => {
    if (connection) {
      setupCallReception(
        connection,
        userId,
        handleReceiveCallOffer,
        addIceCandidate
      );

      return () => {
        connection.off("ReceiveDirectCall");
        connection.off("ReceiveIceCandidate");
      };
    }
  }, [connection, userId, handleReceiveCallOffer, addIceCandidate]);

  return { connection };
};
