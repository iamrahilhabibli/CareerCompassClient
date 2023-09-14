import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

const startConnection = async (connection) => {
  try {
    if (connection.state === HubConnectionState.Connected) {
      console.log("SignalR Connection is already connected.");
      return;
    }

    if (connection.state !== HubConnectionState.Disconnected) {
      throw new Error("Connection is not in a 'Disconnected' state");
    }

    await connection.start();
    console.log("SignalR Connection successfully started for VIDEO");
  } catch (error) {
    console.error("Failed to start SignalR Connection:", error);
  }
};

const setupCallReception = (
  connection,
  userId,
  handleReceiveCallOffer,
  handleCallDeclined,
  addIceCandidate
) => {
  connection.on(
    "ReceiveDirectCall",
    async (callerId, recipientId, offerJson) => {
      if (userId === recipientId) {
        const offer = JSON.parse(offerJson);
        handleReceiveCallOffer(callerId, recipientId, offer);
      }
    }
  );
  connection.on("ReceiveCallDeclined", (callerId, recipientId) => {
    if (userId === recipientId) {
      handleCallDeclined();
    }
  });

  connection.on("ReceiveIceCandidate", (iceCandidateJson) => {
    try {
      const iceCandidate = JSON.parse(iceCandidateJson);
      addIceCandidate(iceCandidate);
    } catch (error) {
      console.error("Error handling received ICE candidate:", error);
    }
  });
};

const joinGroups = (connection, userId, jobseekerContacts) => {
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
  handleCallDeclined,
  token,
  addIceCandidate
) => {
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`https://localhost:7013/video?access_token=${token}`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 1000, 5000, 10000])
        .configureLogging(LogLevel.Information)
        .build();

      setConnection(newConnection);
    }
  }, [token]);

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
    console.log("Joining ");
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
        handleCallDeclined,
        addIceCandidate
      );

      return () => {
        connection.off("ReceiveDirectCall");
        connection.off("ReceiveCallDeclined");
        connection.off("ReceiveIceCandidate");
      };
    }
  }, [connection, userId, handleReceiveCallOffer, handleCallDeclined]);

  return { connection };
};
