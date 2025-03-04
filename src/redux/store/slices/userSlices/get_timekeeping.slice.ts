
import { IGetTimeKeeping } from "@/models/userInterface";
import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface State {
  datas: IGetTimeKeeping[];
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: State = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchTimekeeping = createAsyncThunk(
  "user/fetchTimekeeping",
  async (params: { group?: string,user_id?:string } , thunkAPI) => {
    try {
      const data = await userService.getTimeKeeping(params ?? {});
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch User Infos");
    }
  }
);

const timekeepingSlice = createSlice({
  name: "user_timekeeping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimekeeping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimekeeping.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchTimekeeping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default timekeepingSlice;
