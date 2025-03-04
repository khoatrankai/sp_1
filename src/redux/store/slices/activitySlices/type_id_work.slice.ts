import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import activityService from '@/services/activityService';
import { IGetTypeWork } from '@/models/activityInterface';

const initialState: DataStateRedux< IGetTypeWork | undefined> = {
  datas: undefined,
  loading: false,
  error: null,
};

export const fetchTypeWorksID = createAsyncThunk(
  'typeWorkID/fetchTypeWorksID',
  async (type_id:string , thunkAPI) => {
    try {
      const response = await activityService.getFullTypeWorkById(type_id);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch type works');
    }
  }
);


const typeWorkIDSlice = createSlice({
  name: 'typeWork',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeWorksID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeWorksID.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchTypeWorksID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
}).reducer;

export default typeWorkIDSlice;
