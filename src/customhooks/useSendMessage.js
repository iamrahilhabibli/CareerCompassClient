import { useDispatch } from "react-redux";
import { addMessage } from "../reducers/messageSlice";

export const useSendMessage = (toast) => {
  const dispatch = useDispatch();

  const handleSendMessage = async (
    inputMessage,
    userId,
    currentRecipientId,
    connectionRef
  ) => {
    if (!inputMessage || !userId || !currentRecipientId) {
      toast({
        title: "Incomplete information.",
        description: "Make sure you're logged in and a recipient is selected.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newMessage = {
      senderId: userId,
      receiverId: currentRecipientId,
      content: inputMessage,
      isRead: false,
      messageType: "Text",
    };

    console.log("New Message to be sent: ", newMessage);

    try {
      console.log("About to invoke SignalR method...");
      await connectionRef.current.invoke(
        "SendMessageAsync",
        userId,
        currentRecipientId,
        inputMessage
      );
      console.log("Invoked SignalR method.");

      const response = await fetch("https://localhost:7013/api/Messages/Send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: data.Message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.Message);
      }

      dispatch(
        addMessage({ recipientId: currentRecipientId, message: newMessage })
      );
    } catch (err) {
      console.error("Error in sending message: ", err);
    }
  };

  return handleSendMessage;
};
