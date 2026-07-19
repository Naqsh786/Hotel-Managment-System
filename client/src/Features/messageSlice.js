import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: Send message (Auth required)
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/messages", messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to send message");
    }
  }
);

// Async thunk: Fetch messages for Admin
export const fetchAdminMessages = createAsyncThunk(
  "messages/fetchAdminMessages",
  async ({ page, search }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `/api/messages/admin/list?page=${page}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch admin messages");
    }
  }
);

// Async thunk: Delete message
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete message");
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    success: false,
    totalMessages: 0,
    totalPages: 0,
  },
  reducers: {
    clearStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Fetch Admin Messages
      .addCase(fetchAdminMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.messages = payload.data;
        state.totalMessages = payload.pagination.total;
        state.totalPages = payload.pagination.pages;
      })
      .addCase(fetchAdminMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Delete Message
      .addCase(deleteMessage.fulfilled, (state, { payload }) => {
        state.messages = state.messages.filter(msg => msg._id !== payload);
        state.totalMessages -= 1;
      });
  }
});

export const { clearStatus } = messageSlice.actions;
export default messageSlice.reducer;
