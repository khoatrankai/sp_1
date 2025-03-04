import contractService from "@/services/contractService.";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ContractState {
  datas: {
    contractTotal: number;
    contractActive: number;
    contractReadyExpired: number;
    contractExpired: number;
  }; // Định nghĩa kiểu cho dữ liệu trả về của `project type`
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: ContractState = {
  datas: {
    contractActive: 0,
    contractExpired: 0,
    contractReadyExpired: 0,
    contractTotal: 0,
  },
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchContractAbout = createAsyncThunk(
  "contract/fetchContractAbout",
  async (_, thunkAPI) => {
    try {
      const types = await contractService.getContractAbout();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch project types");
    }
  }
);

const aboutContractSlice = createSlice({
  name: "about_contract",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractAbout.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchContractAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default aboutContractSlice;
