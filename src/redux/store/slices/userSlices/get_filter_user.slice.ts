import { InfoUser } from "@/models/userInterface";
import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserState {
  datas: InfoUser[];
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: UserState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchUserFilter = createAsyncThunk(
  "user/fetchUserFilter",
  async (params: { group?: string }, thunkAPI) => {
    try {
      const data = await userService.getFilterUser(params ?? {});
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch User Infos");
    }
  }
);

const userFilterSlice = createSlice({
  name: "user_info_filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFilter.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchUserFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default userFilterSlice;
