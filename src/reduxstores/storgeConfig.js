import { configureStore } from "@reduxjs/toolkit";
import searchHistorySlice from "../reducers/searchHistorySlice";

export const store = configureStore({
  reducer: {
    searchHistory: searchHistorySlice,
  },
});
