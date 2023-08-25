import { createSlice } from "@reduxjs/toolkit";

export const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    content: null,
    download: false,
  },
  reducers: {
    setResumeContent: (state, action) => {
      state.content = action.payload;
    },
    triggerDownload: (state) => {
      state.download = true;
    },
    resetDownload: (state) => {
      state.download = false;
    },
  },
});

export const { setResumeContent, triggerDownload, resetDownload } =
  resumeSlice.actions; // Include the new action in export
export default resumeSlice.reducer;
