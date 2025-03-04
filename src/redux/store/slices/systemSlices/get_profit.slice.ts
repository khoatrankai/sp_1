
import { Profit } from '@/models/systemInterface';
import systemService from '@/services/systemService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: Profit[]; // Định nghĩa kiểu cho dữ liệu trả về của `product Vat`
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
export const fetchSystemProfits = createAsyncThunk(
  'system/fetchSystemProfits',
  async (_, thunkAPI) => {
    try {
      const Profits = await systemService.getProfits();
      return Profits; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product Vats');
    }
  }
);

const profitSystemSlice = createSlice({
  name: 'profit_system',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemProfits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemProfits.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchSystemProfits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default profitSystemSlice;
