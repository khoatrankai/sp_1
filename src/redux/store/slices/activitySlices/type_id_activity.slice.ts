import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import activityService from '@/services/activityService';
import { IGetTypeActivity } from '@/models/activityInterface';

const initialState: DataStateRedux< IGetTypeActivity | undefined> = {
  datas: undefined,
  loading: false,
  error: null,
};

export const fetchTypeActivitiesID = createAsyncThunk(
  'typeActivityID/fetchTypeActivitiesID',
  async (type_id:string , thunkAPI) => {
    try {
      const response = await activityService.getFullTypeActivityById(type_id);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch type activities');
    }
  }
);


const typeActivityIDSlice = createSlice({
  name: 'typeActivity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeActivitiesID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeActivitiesID.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchTypeActivitiesID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
}).reducer;

export default typeActivityIDSlice;
