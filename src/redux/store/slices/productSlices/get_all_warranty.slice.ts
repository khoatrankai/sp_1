// import { IAccountCustomers } from "@/models/customerInterface";
import { GetWarranty } from "@/models/productInterface";
import productService from "@/services/productService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface CustomerState {
  datas: GetWarranty[];
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
export const fetchWarranties = createAsyncThunk(
  "customer/fetchWarranties",
  async (id: string , thunkAPI) => {
    try {
      const data = await productService.getWarrantiesByAsset(id ?? "");
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch customer Infos");
    }
  }
);

const warrantiesSlice = createSlice({
  name: "warranties_asset",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarranties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarranties.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchWarranties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default warrantiesSlice;
