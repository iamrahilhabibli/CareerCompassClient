import { createSlice } from "@reduxjs/toolkit";

// Load initial state from local storage
const initialState = {
  searchHistory: JSON.parse(localStorage.getItem("searchHistory") || "[]"),
};

export const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addSearch: (state, action) => {
      state.searchHistory.push(action.payload);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(state.searchHistory)
      );
    },
    removeSearch: (state, action) => {
      state.searchHistory.splice(action.payload, 1);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify(state.searchHistory)
      );
    },
  },
});

export const { addSearch, removeSearch } = searchHistorySlice.actions;

export default searchHistorySlice.reducer;
