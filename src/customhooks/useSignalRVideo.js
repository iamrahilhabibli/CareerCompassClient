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
  createAnswer
) => {
  connection.on(
    "ReceiveDirectCall",
    async (callerId, recipientId, offerJson) => {
      if (userId === recipientId) {
        const offer = JSON.parse(offerJson);
        const answer = await createAnswer(offer);
        console.log(offer);
        await connection.invoke(
          "AnswerDirectCallAsync",
          callerId,
          JSON.stringify(answer)
        );
        handleReceiveCallOffer(callerId, recipientId, offer);
      }
    }
  );
};

const joinGroups = (connection, userId, jobseekerContacts) => {
  if (jobseekerContacts && connection.state === HubConnectionState.Connected) {
    jobseekerContacts.forEach((contact) => {
      connection
        .invoke("JoinGroup", userId, contact.recruiterAppUserId)
        .catch((err) => console.error("Error joining the group:", err));
    });
  }
};

export const useSignalRVideo = (
  userId,
  handleReceiveCallOffer,
  jobseekerContacts,
  createAnswer
) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7013/video")
      .withAutomaticReconnect([0, 1000, 5000, 10000])
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      startConnection(connection)
        .then(() => {
          setupCallReception(
            connection,
            userId,
            handleReceiveCallOffer,
            createAnswer
          );
          joinGroups(connection, userId, jobseekerContacts);
        })
        .catch((err) => console.error(err));

      return () => {
        connection.off("ReceiveDirectCall");
        if (connection.state === HubConnectionState.Connected) {
          connection
            .stop()
            .then(() => console.log("SignalR Connection successfully stopped"))
            .catch((err) =>
              console.error("Error while stopping the connection:", err)
            );
        }
      };
    }
  }, [
    connection,
    userId,
    handleReceiveCallOffer,
    jobseekerContacts,
    createAnswer,
  ]);

  return { connection };
};
