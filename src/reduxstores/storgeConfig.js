import { configureStore } from "@reduxjs/toolkit";
import searchHistorySlice from "../reducers/searchHistorySlice";
import resumeReducer from "../reducers/resumeSlice";
import downloadReducer from "../reducers/downloadSlice";
import jobVacancyReducer from "../reducers/jobVacancySlice";
import applicantReducer from "../reducers/applicantSlice";
import messageReducer from "../reducers/messageSlice";
import callReducer from "../reducers/callSlice";
import iceCandidateReducer from "../reducers/iceCandidateSlice";
export const store = configureStore({
  reducer: {
    searchHistory: searchHistorySlice,
    resume: resumeReducer,
    download: downloadReducer,
    jobVacancy: jobVacancyReducer,
    applicant: applicantReducer,
    messages: messageReducer,
    call: callReducer,
    iceCandidate: iceCandidateReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
