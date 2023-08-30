import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateStatusAsync = createAsyncThunk(
  "applicant/updateStatus",
  async ({ applicationId, status }, thunkAPI) => {
    const response = await axios.post(
      `https://localhost:7013/api/JobApplications/UpdateStatus`,
      {
        applicationId,
        status,
      }
    );
    return { applicationId, status: response.data.status };
  }
);
export const applicantSlice = createSlice({
  name: "applicant",
  initialState: {
    applicants: [],
    status: "idle",
  },
  extraReducers: (builder) => {
    builder.addCase(updateStatusAsync.fulfilled, (state, action) => {
      const { applicationId, status } = action.payload;
      const applicant = state.applicants.find(
        (app) => app.applicationid === applicationId
      );
      if (applicant) {
        applicant.status = status;
      }
    });
  },
});

export default applicantSlice.reducer;
