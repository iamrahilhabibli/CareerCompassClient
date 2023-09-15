import { createSlice } from "@reduxjs/toolkit";

export const iceCandidateSlice = createSlice({
  name: "iceCandidate",
  initialState: {
    candidates: [],
  },
  reducers: {
    storeIceCandidate: (state, action) => {
      state.candidates.push(action.payload);
    },
    clearIceCandidates: (state) => {
      state.candidates = [];
    },
  },
});

export const { storeIceCandidate, clearIceCandidates } =
  iceCandidateSlice.actions;

export default iceCandidateSlice.reducer;
