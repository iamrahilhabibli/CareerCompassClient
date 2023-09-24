import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useDispatch } from "react-redux";
import { storeIceCandidate } from "../reducers/iceCandidateSlice";

const startConnection = async (connection) => {
  try {
    if (connection.state === HubConnectionState.Connected) {
      return;
    }

    if (connection.state !== HubConnectionState.Disconnected) {
      throw new Error("Connection is not in a 'Disconnected' state");
    }

    await connection.start();
  } catch (error) {
    console.error("Failed to start SignalR Connection:", error);
  }
};

const setupCallReception = (
  connection,
  userId,
  handleReceiveCallOffer,
  handleCallDeclined,
  addIceCandidate,
  dispatch
) => {
  connection.on(
    "ReceiveDirectCall",
    async (callerId, recipientId, offerJson) => {
      if (userId === recipientId) {
        const offer = JSON.parse(offerJson);
        handleReceiveCallOffer(callerId, offer);
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
      dispatch(storeIceCandidate(iceCandidate));
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
  addIceCandidate,
  handleAddIceCandidate
) => {
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

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
        addIceCandidate,
        dispatch,
        handleAddIceCandidate
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
