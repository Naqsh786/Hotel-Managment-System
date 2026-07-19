import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all food items
export const fetchAllFoods = createAsyncThunk(
  "foods/fetchAllFoods",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/food");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch foods");
    }
  }
);

// Async thunk to add new food item
export const addFood = createAsyncThunk(
  "foods/addFood",
  async (foodData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post("/api/food", foodData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to add food");
    }
  }
);

// Async thunk to update food item
export const updateFood = createAsyncThunk(
  "foods/updateFood",
  async ({ id, foodData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(`/api/food/${id}`, foodData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update food");
    }
  }
);

// Async thunk to delete food item
export const deleteFood = createAsyncThunk(
  "foods/deleteFood",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/food/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete food");
    }
  }
);

const foodSlice = createSlice({
  name: "foods",
  initialState: {
    foods: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearFoodError: (state) => {
      state.error = null;
    },
    clearFoodSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFoods.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.foods = payload;
      })
      .addCase(fetchAllFoods.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFood.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.foods.unshift(payload);
      })
      .addCase(addFood.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(updateFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFood.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.foods = state.foods.map((food) =>
          food._id === payload._id ? payload : food
        );
      })
      .addCase(updateFood.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(deleteFood.fulfilled, (state, { payload }) => {
        state.foods = state.foods.filter((food) => food._id !== payload);
      });
  },
});

export const { clearFoodError, clearFoodSuccess } = foodSlice.actions;
export default foodSlice.reducer;
