import { TargetRevenue } from "@/models/systemInterface";
import systemService from "@/services/systemService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ProductState {
  datas: TargetRevenue[]; // Định nghĩa kiểu cho dữ liệu trả về của `product Vat`
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: ProductState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchTargetRevenue = createAsyncThunk(
  "system/fetchTargetRevenue",
  async (_, thunkAPI) => {
    try {
      const Profits = await systemService.getTargets();
      return Profits; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch product Vats");
    }
  }
);

const targetRevenueSlice = createSlice({
  name: "target_revenue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTargetRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTargetRevenue.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchTargetRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default targetRevenueSlice;
