
import { ITypePackage } from '@/models/priceQuoteInterface';
import priceQuoteService from '@/services/priceQuoteService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface TypePackageState {
  datas: ITypePackage[]; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: TypePackageState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchTypePackage = createAsyncThunk(
  'product/fetchProductOriginals',
  async (_, thunkAPI) => {
    try {
      const types = await priceQuoteService.getTypePackages();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product types');
    }
  }
);

const typePackageSlice = createSlice({
  name: 'type_package',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypePackage.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchTypePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default typePackageSlice;
