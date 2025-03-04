
import { IGetProductInfo } from '@/models/productInterface';
import productService from '@/services/productService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: IGetProductInfo[]; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
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
export const fetchProductInfos = createAsyncThunk(
  'product/fetchProductInfos',
  async (_, thunkAPI) => {
    try {
      const types = await productService.getProducts();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product infos');
    }
  }
);

const infoProductSlice = createSlice({
  name: 'info_product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductInfos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductInfos.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchProductInfos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default infoProductSlice;
