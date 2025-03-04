import { IAccountCustomers } from "@/models/customerInterface";
import customerService from "@/services/customerService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface CustomerState {
  datas: IAccountCustomers[];
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
export const fetchCustomerAccounts = createAsyncThunk(
  "customer/fetchCustomerAccounts",
  async (filter: { customer_info?: string } | undefined, thunkAPI) => {
    try {
      const data = await customerService.getAllAccountCustomer(filter);
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch customer Infos");
    }
  }
);

const customerAccountSlice = createSlice({
  name: "customer_info",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAccounts.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchCustomerAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default customerAccountSlice;
