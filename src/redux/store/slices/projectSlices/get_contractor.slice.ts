
import { IGetContractor } from '@/models/projectInterface';
import projectService from '@/services/projectService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProductState {
  datas: IGetContractor[]; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
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
export const fetchContractors = createAsyncThunk(
  'project/fetchContractors',
  async (_, thunkAPI) => {
    try {
      const types = await projectService.getContractors();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch product types');
    }
  }
);

const contractorsProjectSlice = createSlice({
  name: 'contractor_project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default contractorsProjectSlice;
