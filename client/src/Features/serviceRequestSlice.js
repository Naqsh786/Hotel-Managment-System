import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/service-requests';

// Create Service Request
export const createServiceRequest = createAsyncThunk('serviceRequests/create', async (requestData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.post(API_URL, requestData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to create request");
  }
});

// Fetch My Service Requests
export const fetchMyServiceRequests = createAsyncThunk('serviceRequests/fetchMy', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch my requests");
  }
});

// Fetch All Service Requests (Admin/Staff)
export const fetchAllServiceRequests = createAsyncThunk('serviceRequests/fetchAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch requests");
  }
});

// Update Service Status
export const updateServiceStatus = createAsyncThunk('serviceRequests/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    const response = await axios.patch(`${API_URL}/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data; // Backend returns { success: true, data: request }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to update status");
  }
});

const serviceRequestSlice = createSlice({
  name: 'serviceRequests',
  initialState: {
    requests: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetServiceState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createServiceRequest.pending, (state) => { state.loading = true; })
      .addCase(createServiceRequest.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createServiceRequest.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchMyServiceRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchMyServiceRequests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.requests = payload;
      })
      .addCase(fetchMyServiceRequests.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(fetchAllServiceRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchAllServiceRequests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.requests = payload;
      })
      .addCase(fetchAllServiceRequests.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateServiceStatus.fulfilled, (state, { payload }) => {
        // payload is the updated request
        state.requests = state.requests.map((req) => req._id === payload._id ? payload : req);
      });
  }
});

export const { resetServiceState } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;
