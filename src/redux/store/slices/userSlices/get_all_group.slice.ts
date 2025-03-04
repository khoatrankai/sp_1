import { IGetGroupUser } from "@/models/userInterface";
import userService from "@/services/userService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface UserState {
  datas: IGetGroupUser[];
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: UserState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchGroupUser = createAsyncThunk(
  "user/fetchGroupUser",
  async (_, thunkAPI) => {
    try {
      const data = await userService.getGroupUser();
      return data; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch User Infos");
    }
  }
);

const userGroupSlice = createSlice({
  name: "user_group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupUser.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchGroupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default userGroupSlice;
