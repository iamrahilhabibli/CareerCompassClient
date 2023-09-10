import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

export const useSignalRConnection = (
  userId,
  currentRecipientId,
  dispatch,
  addMessage
) => {
  const connectionRef = useRef(null);

  useEffect(() => {
    const startConnection = async () => {
      try {
        await connectionRef.current.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.error("Error establishing connection: ", err);
      }
    };

    const handleReceiveUnreadMessages = (unreadMessages) => {
      dispatch(
        addMessage({
          recipientId: currentRecipientId,
          messages: unreadMessages,
        })
      );
    };

    if (userId) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7013/chat")
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .configureLogging(signalR.LogLevel.Debug)
        .build();

      connectionRef.current = connection;

      connection.on("ReceiveMessage", (senderId, recipientId, message) => {
        if (
          recipientId === currentRecipientId ||
          senderId === currentRecipientId
        ) {
          dispatch(
            addMessage({
              recipientId: currentRecipientId,
              message: {
                senderId,
                content: message,
                isRead: false,
                messageType: "Text",
              },
            })
          );
        }
      });

      connection.on("ReceiveUnreadMessages", handleReceiveUnreadMessages);

      startConnection();
    }

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [userId, currentRecipientId, dispatch, addMessage]);
  return connectionRef;
};
