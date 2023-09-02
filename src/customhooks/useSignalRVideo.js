import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
export const useSignalRVideo = (userId, handleReceiveCallOffer) => {
  console.log("useSignalRVideo hook executed", userId);
  useEffect(() => {
    // Initialize SignalR connection
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7013/chat")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    // Start SignalR connection
    connection
      .start()
      .then(() => console.log("Connection started VIDEOCALL"))
      .catch((err) => {
        console.error("Error establishing connection: ", err);
        // Add some UI friendly error message if needed
      });

    // Handle receiving call offer
    connection.on("ReceiveCallOffer", (callerId, recipientId, offer) => {
      handleReceiveCallOffer(callerId, recipientId, offer);
    });

    return () => {
      connection.stop();
    };
  }, [userId, handleReceiveCallOffer]);
};
