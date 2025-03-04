
import { Vat } from '@/models/systemInterface';
import systemService from '@/services/systemService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: Vat[]; // Định nghĩa kiểu cho dữ liệu trả về của `product Vat`
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
export const fetchSystemVats = createAsyncThunk(
  'system/fetchSystemVats',
  async (_, thunkAPI) => {
    try {
      const Vats = await systemService.getVats();
      return Vats; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product Vats');
    }
  }
);

const vatSystemSlice = createSlice({
  name: 'vat_system',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemVats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemVats.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchSystemVats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default vatSystemSlice;
