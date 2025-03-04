import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import activityService from '@/services/activityService';
import { IGetTypeActivity, ICreateTypeActivity, IUpdateTypeActivity } from '@/models/activityInterface';

const initialState: DataStateRedux<IGetTypeActivity[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchTypeActivities = createAsyncThunk(
  'typeActivity/fetchTypeActivities',
  async (_, thunkAPI) => {
    try {
      const response = await activityService.getAllTypeActivities();
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch type activities');
    }
  }
);

export const createTypeActivity = createAsyncThunk(
  'typeActivity/createTypeActivity',
  async (data: ICreateTypeActivity, thunkAPI) => {
    try {
      const response = await activityService.createTypeActivity(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create type activity');
    }
  }
);

export const updateTypeActivity = createAsyncThunk(
  'typeActivity/updateTypeActivity',
  async ({ type_id, data }: { type_id: string; data: IUpdateTypeActivity }, thunkAPI) => {
    try {
      const response = await activityService.updateTypeActivity(type_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update type activity');
    }
  }
);

const typeActivitySlice = createSlice({
  name: 'typeActivity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchTypeActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTypeActivity.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateTypeActivity.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.type_activity_id === action.payload.data.type_activity_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default typeActivitySlice;
