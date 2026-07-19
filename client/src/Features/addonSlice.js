import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all addons
export const fetchAddons = createAsyncThunk(
  "addons/fetchAddons",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/addons");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch addons");
    }
  }
);

// Async thunk to add an addon
export const addAddon = createAsyncThunk(
  "addons/addAddon",
  async (addonData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/admin/addons", addonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to add addon");
    }
  }
);

// Async thunk to update an addon
export const updateAddon = createAsyncThunk(
  "addons/updateAddon",
  async ({ id, addonData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`/api/admin/addons/${id}`, addonData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update addon");
    }
  }
);

// Async thunk to delete an addon
export const deleteAddon = createAsyncThunk(
  "addons/deleteAddon",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/admin/addons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete addon");
    }
  }
);

const addonSlice = createSlice({
  name: "addons",
  initialState: {
    addons: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearAddonStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddons.pending, (state) => { state.loading = true; })
      .addCase(fetchAddons.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.addons = payload || [];
      })
      .addCase(fetchAddons.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addAddon.pending, (state) => { state.loading = true; })
      .addCase(addAddon.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          state.addons.push(payload);
        }
        state.success = true;
      })
      .addCase(addAddon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateAddon.pending, (state) => { state.loading = true; })
      .addCase(updateAddon.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload) {
          state.addons = state.addons.map(addon => addon._id === payload._id ? payload : addon);
        }
        state.success = true;
      })
      .addCase(updateAddon.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteAddon.fulfilled, (state, { payload }) => {
        state.addons = state.addons.filter(addon => addon._id !== payload);
        state.success = true;
      });
  }
});

export const { clearAddonStatus } = addonSlice.actions;
export default addonSlice.reducer;
