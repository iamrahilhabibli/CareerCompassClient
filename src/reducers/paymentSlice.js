import { createSlice } from "@reduxjs/toolkit";

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    success: false,
  },
  reducers: {
    paymentSuccess: (state) => {
      state.success = true;
    },
    resetPayment: (state) => {
      state.success = false;
    },
  },
});

export const { paymentSuccess, resetPayment } = paymentSlice.actions;
export const selectPaymentSuccess = (state) => state.payment.success;
export default paymentSlice.reducer;
