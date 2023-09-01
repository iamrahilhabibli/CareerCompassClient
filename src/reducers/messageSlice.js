import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {};

export const messageSlice = createSlice({
  name: "messages",
  initialState: {},
  reducers: {
    addMessage: (state, action) => {
      const { recipientId, message } = action.payload;
      const standardizedMessage = {
        senderId: message.senderId,
        receiverId: recipientId,
        content: message.content,
        isRead: message.isRead,
        messageType: message.messageType,
      };

      if (!state[recipientId]) {
        state[recipientId] = [];
      }

      state[recipientId].push(standardizedMessage);
    },
  },
});

export const { addMessage } = messageSlice.actions;

export default messageSlice.reducer;
