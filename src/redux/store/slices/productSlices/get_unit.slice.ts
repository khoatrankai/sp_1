
import {  IUnitProduct } from '@/models/productInterface';
import productService from '@/services/productService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: IUnitProduct[]; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
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
export const fetchProductUnits = createAsyncThunk(
  'product/fetchProductUnits',
  async (_, thunkAPI) => {
    try {
      const types = await productService.getUnits();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product types');
    }
  }
);

const unitProductSlice = createSlice({
  name: 'unit_product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductUnits.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchProductUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default unitProductSlice;
