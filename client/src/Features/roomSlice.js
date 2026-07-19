import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for Admin: Fetch rooms with pagination/search
export const fetchAdminRooms = createAsyncThunk(
  "rooms/fetchAdminRooms",
  async ({ page, search, type }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `/api/rooms/admin/list?page=${page}&search=${search}&type=${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch admin rooms");
    }
  }
);

// Async thunk for Public: Fetch all rooms
export const fetchAllRooms = createAsyncThunk(
  "rooms/fetchAllRooms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/rooms");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch rooms");
    }
  }
);

// Async thunk for Public: Fetch single room details
export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/rooms/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Room not found");
    }
  }
);

// Async thunk for Admin: Add new room (Multipart)
export const addRoom = createAsyncThunk(
  "rooms/addRoom",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/rooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to add room");
    }
  }
);

// Async thunk for Admin: Update room
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`/api/rooms/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update room");
    }
  }
);

// Async thunk for Admin: Delete room
export const deleteRoom = createAsyncThunk(

  "rooms/deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete room");
    }
  }
);

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    currentRoom: null,
    totalRooms: 0,
    totalPages: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    },
    clearRoomSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Admin Rooms
      .addCase(fetchAdminRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminRooms.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.rooms = payload.data;
        state.totalRooms = payload.pagination.total;
        state.totalPages = payload.pagination.pages;
      })
      .addCase(fetchAdminRooms.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Fetch All Rooms (Public)
      .addCase(fetchAllRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRooms.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.rooms = payload;
      })
      .addCase(fetchAllRooms.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Fetch Single Room (Public)
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentRoom = payload;
      })
      .addCase(fetchRoomById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Add Room
      .addCase(addRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.rooms.unshift(payload);
      })
      .addCase(addRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Update Room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.rooms = state.rooms.map((room) =>
          room._id === payload._id ? payload : room
        );
      })
      .addCase(updateRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Delete Room
      .addCase(deleteRoom.fulfilled, (state, { payload }) => {

        state.rooms = state.rooms.filter((room) => room._id !== payload);
        state.totalRooms -= 1;
      });
  },
});

export const { clearRoomError, clearRoomSuccess } = roomSlice.actions;
export default roomSlice.reducer;
