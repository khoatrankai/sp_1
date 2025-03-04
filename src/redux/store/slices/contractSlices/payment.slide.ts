import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import {
  ICreatePayment,
  IGetPayment,
  IUpdatePayment,
} from "@/models/contractInterface";
import contractService from "@/services/contractService.";

const initialState: DataStateRedux<IGetPayment[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
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

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (data: ICreatePayment, thunkAPI) => {
    try {
      const response = await contractService.createPayment(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create payment");
    }
  }
);

export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async ({ id, data }: { id: string; data: IUpdatePayment }, thunkAPI) => {
    try {
      const response = await contractService.updatePayment(id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update payment");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.payment_id === action.payload.data.payment_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default paymentSlice;
