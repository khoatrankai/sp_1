
import { Province } from '@/models/systemInterface';
import systemService from '@/services/systemService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: Province[]; // Định nghĩa kiểu cho dữ liệu trả về của `product Vat`
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
export const fetchSystemProvinces = createAsyncThunk(
  'system/fetchSystemProvinces',
  async (_, thunkAPI) => {
    try {
      const data = await systemService.getProvinces();
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product Vats');
    }
  }
);

const provinceSystemSlice = createSlice({
  name: 'province_system',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemProvinces.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchSystemProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default provinceSystemSlice;
