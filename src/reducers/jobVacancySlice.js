import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentApplicationCount: 0,
  applicationLimit: 0,
};

const jobVacancySlice = createSlice({
  name: "jobVacancy",
  initialState,
  reducers: {
    updateApplicationCount: (state, action) => {
      state.currentApplicationCount = action.payload;
    },
    updateApplicationLimit: (state, action) => {
      state.applicationLimit = action.payload;
    },
  },
});

export const { updateApplicationCount, updateApplicationLimit } =
  jobVacancySlice.actions;

export default jobVacancySlice.reducer;
