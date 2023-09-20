import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {};

export const messageSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    addMessage: (state, action) => {
      const { recipientId, message } = action.payload;
      const standardizedMessage = {
        senderId: message.senderId,
        receiverId: recipientId,
        content: message.content,
        isRead: message.isRead,
        messageType: message.messageType,
        timestamp: message.timestamp || new Date().toISOString(),
      };

      if (!state[recipientId]) {
        state[recipientId] = [];
      }

      state[recipientId].push(standardizedMessage);
    },
    loadInitialMessages: (state, action) => {
      const { recipientId, messages } = action.payload;
      if (!state[recipientId]) {
        state[recipientId] = [];
      }
      state[recipientId] = [...messages];
    },
  },
});

export const { addMessage, loadInitialMessages } = messageSlice.actions;

export default messageSlice.reducer;
