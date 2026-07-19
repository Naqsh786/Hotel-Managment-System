import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/login", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

// Async thunk for Verify Login OTP (Admin)
export const verifyLoginOTP = createAsyncThunk(
  "auth/verifyLoginOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/verify-login-otp", otpData);
      sessionStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "OTP verification failed");
    }
  }
);

// Async thunk for Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/register", userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  }
);

// Async thunk for Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/verify-email", otpData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Verification failed");
    }
  }
);

// Async thunk for Load User Profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");
      const { data } = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      sessionStorage.removeItem("token");
      return rejectWithValue(error.response?.data?.message || error.message || "Session expired");
    }
  }
);

// Async thunk for Updating User Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.patch("/api/auth/profile", userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Update failed");
    }
  }
);

// Async thunk for Updating Password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.patch("/api/auth/update-password", passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: sessionStorage.getItem("token") || null,
    loading: !!sessionStorage.getItem("token"),
    error: null,
    success: false,
    requireOtp: false,
    emailForOtp: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.requireOtp = false;
      sessionStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.requireOtp) {
          state.requireOtp = true;
          state.emailForOtp = payload.email;
        } else {
          state.user = payload.data;
          state.token = payload.token;
          sessionStorage.setItem("token", payload.token);
          state.success = true;
        }
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Verify Login OTP
      .addCase(verifyLoginOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOTP.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.requireOtp = false;
        state.user = payload.data;
        state.token = payload.token;
        state.success = true;
      })
      .addCase(verifyLoginOTP.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
