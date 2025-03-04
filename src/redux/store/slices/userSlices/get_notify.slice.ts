import { DataStateRedux } from "@/models/responseInterface";
import { NotifyItem } from "@/models/userInterface";
import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for user info
const initialState: DataStateRedux<NotifyItem[] | null> = {
  datas: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchNotify = createAsyncThunk(
  "user/fetchNotify",
  async (data: { page: number; limit: number }, thunkAPI) => {
    try {
      const userInfo = await userService.getNotifyUser(data?.page, data?.limit);
      return userInfo; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch user info");
    }
  }
);

const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotify.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchNotify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default notifySlice;
