import { useDispatch } from "react-redux";
import axios from "axios";
import { addMessage } from "./messageActions"; // replace with your actual action

export const sendMessage = async (
  userId,
  currentRecipientId,
  inputMessage,
  addMessageActionCreator
) => {
  const dispatch = useDispatch();
  if (!inputMessage || !userId || !currentRecipientId) {
    // Show toast
    return;
  }

  const newMessage = {
    senderId: userId,
    receiverId: currentRecipientId,
    content: inputMessage,
    isRead: false,
    messageType: "Text",
  };

  try {
    // SignalR code to send message
    // ...

    await axios.post("https://localhost:7013/api/Messages/Send", newMessage);
    dispatch(
      addMessageActionCreator({
        recipientId: currentRecipientId,
        message: newMessage,
      })
    );
  } catch (err) {
    console.error("Error in sending message: ", err);
  }
};
