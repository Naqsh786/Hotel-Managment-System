import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/reviews';

// Create Review
export const addReview = createAsyncThunk('reviews/add', async (reviewData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post(API_URL, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to add review");
  }
});

// Fetch Room Reviews
export const fetchRoomReviews = createAsyncThunk('reviews/fetchByRoom', async (roomId, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/room/${roomId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch room reviews");
  }
});

// Fetch All Reviews (Admin)
export const fetchAllReviewsAdmin = createAsyncThunk('reviews/fetchAllAdmin', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch all reviews");
  }
});

// Delete Review
export const deleteReview = createAsyncThunk('reviews/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to delete review");
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    roomReviews: [],
    adminReviews: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => { state.loading = true; })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addReview.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchRoomReviews.fulfilled, (state, { payload }) => {
        state.roomReviews = payload;
      })
      .addCase(fetchAllReviewsAdmin.pending, (state) => { state.loading = true; })
      .addCase(fetchAllReviewsAdmin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.adminReviews = payload;
      })
      .addCase(deleteReview.fulfilled, (state, { payload }) => {
        state.adminReviews = state.adminReviews.filter(r => r._id !== payload);
      });
  }
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
