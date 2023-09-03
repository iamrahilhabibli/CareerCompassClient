import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

export const useSignalRVideo = (
  userId,
  handleReceiveCallOffer,
  jobseekerContacts
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
      const startConnection = async () => {
        try {
          await connection.start();
          console.log("SignalR Connection successfully started VIDEO");

          connection.on("ReceiveDirectCall", (callerId, recipientId, offer) => {
            if (userId === recipientId) {
              handleReceiveCallOffer(callerId, recipientId, offer);
            }
          });
          if (jobseekerContacts) {
            jobseekerContacts.forEach((contact) => {
              if (connection.state === HubConnectionState.Connected) {
                connection
                  .invoke("JoinGroup", userId, contact.recruiterAppUserId)
                  .catch((err) =>
                    console.error("Error joining the group:", err)
                  );
              }
            });
          }
        } catch (error) {
          console.error("Error while establishing the connection:", error);
        }
      };

      startConnection();

      return () => {
        if (connection.state === HubConnectionState.Connected) {
          connection
            .stop()
            .then(() => {
              console.log("SignalR Connection successfully stopped");
            })
            .catch((err) => {
              console.error("Error while stopping the connection:", err);
            });
        }
      };
    }
  }, [connection, userId, handleReceiveCallOffer, jobseekerContacts]);

  return {};
};
