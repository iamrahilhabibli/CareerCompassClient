import { configureStore } from "@reduxjs/toolkit";
import searchHistorySlice from "../reducers/searchHistorySlice";
import resumeReducer from "../reducers/resumeSlice";
import downloadReducer from "../reducers/downloadSlice";
import jobVacancyReducer from "../reducers/jobVacancySlice";
export const store = configureStore({
  reducer: {
    searchHistory: searchHistorySlice,
    resume: resumeReducer,
    download: downloadReducer,
    jobVacancy: jobVacancyReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
