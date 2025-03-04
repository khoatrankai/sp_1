
import { IGetClassifyType } from '@/models/productInterface';
import productService from '@/services/productService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: IGetClassifyType[]; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
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
export const fetchClassifyType = createAsyncThunk(
  'product/fetchClassifyType',
  async (_, thunkAPI) => {
    try {
      const types = await productService.getClassifies();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product types');
    }
  }
);

const classifyTypeSlice = createSlice({
  name: 'classify_type',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassifyType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassifyType.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchClassifyType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default classifyTypeSlice;
