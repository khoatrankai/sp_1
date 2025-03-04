
import { ICustomerStatistics } from '@/models/customerInterface';
import customerService from '@/services/customerService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CustomerState {
  datas: ICustomerStatistics;
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: CustomerState = {
  datas: {
    totalCustomer: 0,
    totalActive: 0,
    totalInActive: 0,
    contactActive: 0,
    contactInactive: 0,
    contactActiveToday: 0
  },
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchCustomerAbout = createAsyncThunk(
  'customer/fetchCustomerAbout',
  async (_, thunkAPI) => {
    try {
      const data = await customerService.getAboutCustomer();
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch customer Infos');
    }
  }
);

const customerAboutSlice = createSlice({
  name: 'customer_about',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAbout.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchCustomerAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default customerAboutSlice;
