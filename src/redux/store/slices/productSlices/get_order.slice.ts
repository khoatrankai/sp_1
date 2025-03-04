import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface CartState {
  datas: { product_id: string; count: number }[]; // Định nghĩa kiểu cho dữ liệu trả về của `product type`
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: CartState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const getCarts = createAsyncThunk(
  "product/getCarts",
  async (_, thunkAPI) => {
    try {
      const storedValue = localStorage.getItem("carts");
      if (storedValue) {
        return JSON.parse(storedValue);
      } else {
        localStorage.setItem("carts", JSON.stringify([]));
      }
      return [];
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch product infos");
    }
  }
);

export const setCarts = createAsyncThunk(
  "product/setCarts",
  async (data: { product_id: string; count: number }[], thunkAPI) => {
    try {
      localStorage.setItem("carts", JSON.stringify(data));
      toast.success("Thêm vào giỏ thành công", {
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch product infos");
    }
  }
);

const cartsSlice = createSlice({
  name: "cart_product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(setCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload;
      })
      .addCase(getCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default cartsSlice;
