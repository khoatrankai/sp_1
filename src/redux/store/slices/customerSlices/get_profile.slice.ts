import { IAccountCustomers } from "@/models/customerInterface";
import { DataStateRedux } from "@/models/responseInterface";
import customerService from "@/services/roleCustomerService/customerService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state for user info
const initialState: DataStateRedux<IAccountCustomers | null> = {
  datas: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchCustomerProfile = createAsyncThunk(
  "customer/fetchCustomerProfile",
  async (_, thunkAPI) => {
    try {
      const customerProfile = await customerService.getProfileCustomer();
      return customerProfile; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch user info");
    }
  }
);

const customerProfileSlice = createSlice({
  name: "customer_profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
        if (action.payload.statusCode === 400) {
          state.loading = false;
          state.datas = null;
        }
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default customerProfileSlice;
