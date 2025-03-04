
import { CustomerInfo } from '@/models/customerInterface';
import customerService from '@/services/customerService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CustomerState {
  datas: CustomerInfo[]; 
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: CustomerState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchCustomerInfos = createAsyncThunk(
  'customer/fetchCustomerInfos',
  async (_, thunkAPI) => {
    try {
      const data = await customerService.getAllCustomer();
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch customer Infos');
    }
  }
);

const customerInfoSlice = createSlice({
  name: 'customer_info',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerInfos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerInfos.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchCustomerInfos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default customerInfoSlice;
