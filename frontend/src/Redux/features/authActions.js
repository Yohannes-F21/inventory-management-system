import axios from "axios";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

const url = "http://localhost:5000";

export const UserLogin = createAsyncThunk(
    'user/login', async (data, { rejectWithValue }) => {
        try {
            console.log("what about here");
            const response = await axios.post(`${url}/user/auth/login`, data);
            console.log(response, "response from redux");
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
)

export const UserSendOTP = createAsyncThunk(
    'user/sendOTP', async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${url}/user/auth/login-otp`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const UserForgetPassword = createAsyncThunk(
  "user/forget-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/user/auth/forgot-password`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const UserResetPassword = createAsyncThunk(
  "user/reset-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/user/auth/reset-password`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UserVerifyEmail = createAsyncThunk(
  "user/verify-email",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/user/auth/verify-email`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authLogout = createAction("user/logout");

export const UserRegister = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/user/auth/register`, data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const UserChangePassword = createAsyncThunk(
  'user/change-password', async (data, { rejectWithValue }) => {
    const {_id} = data
        try {
          const response = await axios.post(`${url}/user/auth/change-password/${_id}`, data);
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response.data);
        }
    }
)

