import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAmenities = createAsyncThunk(
  "amenities/fetchAmenities",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/admin/amenities");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch amenities");
    }
  }
);

export const addAmenity = createAsyncThunk(
  "amenities/addAmenity",
  async (amenityData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/admin/amenities", amenityData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add amenity");
    }
  }
);

export const updateAmenity = createAsyncThunk(
  "amenities/updateAmenity",
  async ({ id, amenityData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`/api/admin/amenities/${id}`, amenityData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update amenity");
    }
  }
);

export const deleteAmenity = createAsyncThunk(
  "amenities/deleteAmenity",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/admin/amenities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete amenity");
    }
  }
);

const amenitySlice = createSlice({
  name: "amenities",
  initialState: {
    amenities: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearAmenityStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending, (state) => { state.loading = true; })
      .addCase(fetchAmenities.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.amenities = payload;
      })
      .addCase(fetchAmenities.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addAmenity.pending, (state) => { state.loading = true; })
      .addCase(addAmenity.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.amenities.unshift(payload);
        state.success = true;
      })
      .addCase(addAmenity.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateAmenity.fulfilled, (state, { payload }) => {
        state.amenities = state.amenities.map(a => a._id === payload._id ? payload : a);
        state.success = true;
      })
      .addCase(deleteAmenity.fulfilled, (state, { payload }) => {
        state.amenities = state.amenities.filter(a => a._id !== payload);
        state.success = true;
      });
  }
});

export const { clearAmenityStatus } = amenitySlice.actions;
export default amenitySlice.reducer;
