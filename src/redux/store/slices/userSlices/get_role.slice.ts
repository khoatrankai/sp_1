import { GetRoleUser } from '@/models/userInterface';
import { DataStateRedux } from '@/models/responseInterface';
import userService from '@/services/userService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state for user info
const initialState: DataStateRedux<GetRoleUser[] | null> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchRoleAccess = createAsyncThunk(
  'user/fetchRoleAccess',
  async (_, thunkAPI) => {
    try {
      const userInfo = await userService.getRoleUserFullByAccess();
      return userInfo; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch user info');
    }
  }
);

const roleAccessSlice = createSlice({
  name: 'role_access',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoleAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleAccess.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchRoleAccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default roleAccessSlice;
