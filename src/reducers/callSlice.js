import { createSlice } from "@reduxjs/toolkit";

export const callSlice = createSlice({
  name: "call",
  initialState: {
    status: "idle",
  },
  reducers: {
    setIncomingCall: (state) => {
      state.status = "incoming";
    },
    setAcceptedCall: (state) => {
      state.status = "accepted";
    },
    setDeclinedCall: (state) => {
      state.status = "declined";
    },
    setIdle: (state) => {
      state.status = "idle";
    },
  },
});

export const { setIncomingCall, setAcceptedCall, setDeclinedCall, setIdle } =
  callSlice.actions;

export default callSlice.reducer;
