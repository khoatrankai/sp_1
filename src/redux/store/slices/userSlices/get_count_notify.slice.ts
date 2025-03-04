import { DataStateRedux } from "@/models/responseInterface";
import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for user info
const initialState: DataStateRedux<number | string | null> = {
  datas: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchCountNotify = createAsyncThunk(
  "user/fetchCountNotify",
  async (_, thunkAPI) => {
    try {
      const userInfo = await userService.getCountNotifyUser();
      return userInfo; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch user info");
    }
  }
);

const countNotifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountNotify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountNotify.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchCountNotify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default countNotifySlice;
