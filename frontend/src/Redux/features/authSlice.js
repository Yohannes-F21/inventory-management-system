import { createSlice } from "@reduxjs/toolkit";
import {
  UserLogin,
  UserRegister,
  UserSendOTP,
  UserChangePassword,
  UserForgetPassword,
  UserResetPassword,
  UserVerifyEmail,
  authLogout,
} from "./authActions";

const initialState = {
  isAuthenticated: false,
  loggedInSession: false,
  loading: false,
  user: null,
};

console.log(initialState, "initialState");

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(UserLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserLogin.fulfilled, (state, action) => {
        console.log(action, "slice");
        state.loading = false;
        state.loggedInSession = true;
      })
      .addCase(UserLogin.rejected, (state) => {
        state.loading = false;
      })
      .addCase(authLogout, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        // localStorage.removeItem("userInfo");
      })
      .addCase(UserSendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserSendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loggedInSession = false;
        // localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      })
      .addCase(UserSendOTP.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UserForgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserForgetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UserForgetPassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UserResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserResetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UserResetPassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UserVerifyEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserVerifyEmail.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UserVerifyEmail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UserRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserRegister.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UserRegister.rejected, (state) => {
        state.loading = false;
      })
      .addCase(UserChangePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserChangePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UserChangePassword.rejected, (state) => {
        state.loading = false;
      })
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
