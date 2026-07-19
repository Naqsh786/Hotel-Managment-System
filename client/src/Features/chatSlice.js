import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchHistory",
  async (roleOrUserId, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(`/api/chat/history/${roleOrUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch chat history");
    }
  }
);

export const fetchActiveChats = createAsyncThunk(
  "chat/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get("/api/chat/active", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch active chats");
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/chat/send", messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    activeChats: [],
    loading: false,
    error: null,
    unreadCount: 0
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      state.unreadCount += 1;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveChats.fulfilled, (state, action) => {
        state.activeChats = action.payload;
        state.unreadCount = action.payload.filter(chat => chat.unread).length;
      })
      .addCase(sendChatMessage.fulfilled, () => {
        // If the current open chat is the one we sent to, it's already added optimistically or we can add it here.
        // We'll add optimistically to avoid delay, so we might just use this to confirm.
      });
  }
});

export const { addMessage, clearMessages, setUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
