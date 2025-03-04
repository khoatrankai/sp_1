import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import { IGetPayment } from "@/models/contractInterface";
import contractService from "@/services/contractService.";

const initialState: DataStateRedux<IGetPayment[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchPaymentTotal = createAsyncThunk(
  "payment/fetchPaymentTotal",
  async (
    filter: {
      type?: string;
      date_start?: string;
      date_end?: string;
      status?: string;
      supplier?: string;
      contract?: string;
      project?: string;
      typeDate?: "month" | "quarter" | "year";
      export?: boolean;
    },
    thunkAPI
  ) => {
    try {
      const response = await contractService.getAllPayments(filter);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch payments");
    }
  }
);

const paymentTotalSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentTotal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentTotal.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchPaymentTotal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default paymentTotalSlice;
