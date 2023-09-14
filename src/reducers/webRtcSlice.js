// webRTCSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const webRTCSlice = createSlice({
  name: "webRTC",
  initialState: {
    iceCandidateQueue: [],
    remoteDescriptionSet: false,
  },
  reducers: {
    addIceCandidate: (state, action) => {
      state.iceCandidateQueue.push(action.payload);
    },
    setRemoteDescription: (state, action) => {
      state.remoteDescriptionSet = action.payload;
    },
    flushIceCandidateQueue: (state) => {
      state.iceCandidateQueue = [];
    },
  },
});

export const { addIceCandidate, setRemoteDescription, flushIceCandidateQueue } =
  webRTCSlice.actions;

export default webRTCSlice.reducer;
