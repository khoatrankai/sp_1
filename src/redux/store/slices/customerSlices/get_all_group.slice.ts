
import {  GroupInfo } from '@/models/customerInterface';
import customerService from '@/services/customerService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CustomerState {
  datas: GroupInfo[]; 
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
export const fetchGroupCustomer = createAsyncThunk(
  'customer/fetchGroupCustomer',
  async (_, thunkAPI) => {
    try {
      const data = await customerService.getGroupCustomer();
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch customer Infos');
    }
  }
);

const customerGroupSlice = createSlice({
  name: 'customer_group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupCustomer.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchGroupCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default customerGroupSlice;
