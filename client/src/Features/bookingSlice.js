import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/bookings';

// Create Booking
export const makeBooking = createAsyncThunk('bookings/create', async (bookingData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth?.token;
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axios.post(API_URL, bookingData, config);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to create booking");
  }
});

// Fetch All Bookings (Admin)
export const fetchAllBookings = createAsyncThunk('bookings/fetchAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch bookings");
  }
});

// Fetch My Bookings (Guest)
export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch your bookings");
  }
});

// Update Status
export const updateBookingStatus = createAsyncThunk('bookings/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.patch(`${API_URL}/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to update booking status");
    }
});

// Delete Booking
export const deleteBooking = createAsyncThunk('bookings/delete', async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to delete booking");
    }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetBookingState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeBooking.pending, (state) => { state.loading = true; })
      .addCase(makeBooking.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        if (payload) {
          state.bookings.unshift(payload);
        }
      })
      .addCase(makeBooking.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchAllBookings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bookings = payload || [];
      })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bookings = payload || [];
      })
      .addCase(fetchMyBookings.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, { payload }) => {
          state.bookings = state.bookings.map(b => b._id === payload._id ? payload : b);
      })
      .addCase(deleteBooking.fulfilled, (state, { payload }) => {
          state.bookings = state.bookings.filter(b => b._id !== payload);
      });
  }
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
