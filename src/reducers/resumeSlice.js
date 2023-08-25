import { createSlice } from "@reduxjs/toolkit";

export const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    content: null,
  },
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
  },
});

export const { setContent } = resumeSlice.actions;

export const selectResumeContent = (state) => state.resume.content;

export default resumeSlice.reducer;
