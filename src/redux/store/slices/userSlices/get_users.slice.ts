import { InfoUser } from '@/models/userInterface';
import { DataStateRedux } from '@/models/responseInterface';
import userService from '@/services/userService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state for user info
const initialState: DataStateRedux<InfoUser[] | null> = {
  datas: null,
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, thunkAPI) => {
    try {
      const userInfo = await userService.getUsers();
      return userInfo; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch user info');
    }
  }
);

const userInfoSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default userInfoSlice;
