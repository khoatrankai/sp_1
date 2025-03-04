
import {  IAboutProduct } from '@/models/productInterface';
import productService from '@/services/productService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: IAboutProduct; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: ProductState = {
  datas:{
    quantity_active: 0, quantity_hide: 0, quantity_hire: 0, quantity_ordered: 0, quantity_product: 0,
    quantity_stored: 0
  },
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchProductAbout = createAsyncThunk(
  'product/fetchProductAbout',
  async (_, thunkAPI) => {
    try {
      const types = await productService.getAboutProduct();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product types');
    }
  }
);

const aboutProductSlice = createSlice({
  name: 'about_product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductAbout.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchProductAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default aboutProductSlice;
