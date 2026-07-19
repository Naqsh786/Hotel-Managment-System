import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch users");
    }
  }
);

// Async thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (range = 'W', { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(`/api/admin/dashboard-stats?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch stats");
    }
  }
);

// Async thunk to update user status
export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.patch(`/api/admin/users/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update user status");
    }
  }
);

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete user");
    }
  }
);

// Async thunk to fetch home settings
export const fetchHomeSettings = createAsyncThunk(
  "admin/fetchHomeSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/settings/home");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch settings");
    }
  }
);

// Async thunk to update home settings
export const updateHomeSettings = createAsyncThunk(
  "admin/updateHomeSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put("/api/admin/settings/home", settingsData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update settings");
    }
  }
);

// Async thunk to seed sample rooms
export const seedRooms = createAsyncThunk(
  "admin/seedRooms",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/admin/seed-rooms", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to seed rooms");
    }
  }
);

// Async thunk to fetch staff
export const fetchStaff = createAsyncThunk(
  "admin/fetchStaff",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get("/api/admin/staff", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch staff");
    }
  }
);

// Async thunk to add staff
export const addStaff = createAsyncThunk(
  "admin/addStaff",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/admin/staff", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add staff");
    }
  }
);

// Async thunk to update staff
export const updateStaff = createAsyncThunk(
  "admin/updateStaff",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`/api/admin/staff/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update staff");
    }
  }
);

// Async thunk to delete staff
export const deleteStaff = createAsyncThunk(
  "admin/deleteStaff",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/admin/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete staff");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    staff: [],
    homeSettings: null,
    stats: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearAdminState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload;
      })
      .addCase(fetchAllUsers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, { payload }) => {
        state.users = state.users.map(user => user._id === payload._id ? payload : user);
        state.success = true;
      })
      // Fetch Settings
      .addCase(fetchHomeSettings.fulfilled, (state, { payload }) => {
        state.homeSettings = payload;
      })
      // Update Settings
      .addCase(updateHomeSettings.pending, (state) => { state.loading = true; })
      .addCase(updateHomeSettings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.homeSettings = payload;
        state.success = true;
      })
      .addCase(updateHomeSettings.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Seed Rooms
      .addCase(seedRooms.pending, (state) => { state.loading = true; })
      .addCase(seedRooms.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(seedRooms.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.stats = payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.users = state.users.filter(user => user._id !== payload);
        state.success = true;
      })
      // Fetch Staff
      .addCase(fetchStaff.pending, (state) => { state.loading = true; })
      .addCase(fetchStaff.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.staff = payload;
      })
      .addCase(fetchStaff.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Add Staff
      .addCase(addStaff.pending, (state) => { state.loading = true; })
      .addCase(addStaff.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (!state.staff) state.staff = [];
        state.staff.push(payload);
        state.success = true;
      })
      .addCase(addStaff.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Update Staff
      .addCase(updateStaff.pending, (state) => { state.loading = true; })
      .addCase(updateStaff.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (!state.staff) state.staff = [];
        state.staff = state.staff.map(member => member._id === payload._id ? payload : member);
        state.success = true;
      })
      .addCase(updateStaff.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Delete Staff
      .addCase(deleteStaff.fulfilled, (state, { payload }) => {
        if (!state.staff) state.staff = [];
        state.staff = state.staff.filter(member => member._id !== payload);
        state.success = true;
      });
  }
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
