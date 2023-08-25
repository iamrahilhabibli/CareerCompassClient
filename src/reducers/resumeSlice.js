import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: null,
  downloading: false,
  loading: false,
};

export const resumeSlice = createSlice({
  name: "resume",
  initialState,

  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
    clearContent: (state) => {
      state.content = null;
    },
    setDownload: (state, action) => {
      state.downloading = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const { setLoading, setContent, clearContent, setDownload } =
  resumeSlice.actions;
export default resumeSlice.reducer;
