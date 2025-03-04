import { GetCategoryRole } from '@/models/userInterface';
import { DataStateRedux } from '@/models/responseInterface';
import userService from '@/services/userService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state for user info
const initialState: DataStateRedux<GetCategoryRole[] | null> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk to fetch user info
export const fetchCategoryRole = createAsyncThunk(
  'user/fetchCategoryRole',
  async (_, thunkAPI) => {
    try {
      const userInfo = await userService.getCategoryRoleFull();
      return userInfo; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch user info');
    }
  }
);

const categoryRoleSlice = createSlice({
  name: 'category_role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryRole.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchCategoryRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default categoryRoleSlice;
