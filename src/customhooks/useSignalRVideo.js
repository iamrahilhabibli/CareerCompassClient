import { useEffect } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

export const useSignalRVideo = (userId, handleReceiveCallOffer) => {
  console.log("Initializing useSignalRVideo with userId:", userId);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7013/chat")
      .withAutomaticReconnect([0, 1000, 5000, 10000]) // You can configure this
      .configureLogging(LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connection successfully started");
      } catch (error) {
        console.error("Error while establishing the connection:", error);
      }
    };

    startConnection();

    connection.on("ReceiveDirectCall", (callerId, recipientId, offer) => {
      console.log("Debug: Inside ReceiveDirectCall event handler");
      console.log("Debug: Received userId:", recipientId);
      console.log("Debug: Expected userId:", userId);

      if (userId === recipientId) {
        console.log(
          "Debug: userId match found, invoking handleReceiveCallOffer"
        );
        handleReceiveCallOffer(callerId, recipientId, offer);
      } else {
        console.log("Debug: userId match not found, ignoring");
      }
    });

    connection.onclose((error) => {
      console.error(
        "SignalR Connection closed:",
        error ?? "Connection closed without error"
      );
    });

    connection.onreconnecting((error) => {
      console.log("Attempting to reconnect:", error);
    });

    connection.onreconnected((connectionId) => {
      console.log("Successfully reconnected. Connection ID:", connectionId);
    });

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
  }, [userId, handleReceiveCallOffer]);

  return; // Explicitly returning undefined; you can return some value if needed in the future.
};
