import { useEffect } from "react";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";

export const useSignalRVideo = (userId, handleReceiveCallOffer) => {
  console.log("useSignalRVideo", userId);
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7013/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connection started");
      })
      .catch((err) => console.error("Initial connection error:", err));
    connection.on("ReceiveDirectCall", (userId, recipientId, offer) => {
      console.log("ReceiveDirectCall event received", {
        userId,
        recipientId,
        offer,
      });
      if (userId === recipientId) {
        handleReceiveCallOffer(userId, recipientId, offer);
      }
    });

    connection.onclose((error) => {
      console.error(
        "SignalR Connection Closed:",
        error || "Connection closed without error."
      );
    });

    connection.onreconnecting((error) =>
      console.log("Connection is being reestablished:", error)
    );
    connection.onreconnected((connectionId) =>
      console.log(
        "Connection successfully reestablished, connectionId:",
        connectionId
      )
    );

    return () => {
      if (connection.state === HubConnectionState.Connected) {
        connection
          .stop()
          .then(() => console.log("Connection stopped"))
          .catch((err) =>
            console.error("Error while stopping the connection:", err)
          );
      }
    };
  }, [userId, handleReceiveCallOffer]);

  return;
};
