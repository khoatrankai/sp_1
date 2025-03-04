

import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface State {
  datas: boolean;
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: State = {
  datas: false,
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const checkTimekeeping = createAsyncThunk(
  "user/checkTimekeeping",
  async (_ , thunkAPI) => {
    try {
      const data = await userService.checkTimeKeeping();
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch User Infos");
    }
  }
);



const checkTimekeepingSlice = createSlice({
  name: "check_timekeeping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkTimekeeping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkTimekeeping.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(checkTimekeeping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default checkTimekeepingSlice;
