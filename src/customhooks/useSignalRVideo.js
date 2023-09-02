import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
export const useSignalRVideo = (userId, handleReceiveCallOffer) => {
  useEffect(() => {
    // Initialize SignalR connection
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
      .catch((err) => {
        console.error("Error while establishing connection:", err);
      });

    connection.on("ReceiveCallOffer", (callerId, recipientId, offer) => {
      console.log("ReceiveCallOffer event received", {
        callerId,
        recipientId,
        offer,
      });
      handleReceiveCallOffer(callerId, recipientId, offer);
    });

    connection.onclose((error) => {
      console.error("SignalR Connection Closed:", error);
    });

    connection.onreconnecting((error) => {
      console.log("Connection is being reestablished:", error);
    });

    connection.onreconnected((connectionId) => {
      console.log(
        "Connection successfully reestablished, connectionId:",
        connectionId
      );
    });

    connection.onclose((error) => {
      console.error("SignalR Connection Closed:", error);
    });

    return () => {
      connection
        .stop()
        .then(() => console.log("Connection stopped"))
        .catch((err) =>
          console.error("Error while stopping the connection:", err)
        );
    };
  }, [userId, handleReceiveCallOffer]);
};
