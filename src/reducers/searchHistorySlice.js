import { createSlice } from "@reduxjs/toolkit";

export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState: { searchHistory: [] },
  reducers: {
    addSearch: (state, action) => {
      state.searchHistory.push(action.payload);
    },
  },
});

export const { addSearch } = searchHistorySlice.actions;

export default searchHistorySlice.reducer;
