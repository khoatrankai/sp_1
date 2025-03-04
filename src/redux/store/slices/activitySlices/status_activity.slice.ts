import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import activityService from '@/services/activityService';
import { IGetStatusActivity, ICreateStatusActivity, IUpdateStatusActivity } from '@/models/activityInterface';

const initialState: DataStateRedux<IGetStatusActivity[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchStatusActivities = createAsyncThunk(
  'StatusActivity/fetchStatusActivities',
  async (_, thunkAPI) => {
    try {
      const response = await activityService.getAllStatusActivities();
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch Status activities');
    }
  }
);

export const createStatusActivity = createAsyncThunk(
  'StatusActivity/createStatusActivity',
  async (data: ICreateStatusActivity, thunkAPI) => {
    try {
      const response = await activityService.createStatusActivity(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create Status activity');
    }
  }
);

export const updateStatusActivity = createAsyncThunk(
  'StatusActivity/updateStatusActivity',
  async ({ Status_id, data }: { Status_id: string; data: IUpdateStatusActivity }, thunkAPI) => {
    try {
      const response = await activityService.updateStatusActivity(Status_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update Status activity');
    }
  }
);

const statusActivitySlice = createSlice({
  name: 'statusActivity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchStatusActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStatusActivity.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateStatusActivity.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.status_activity_id === action.payload.data.status_activity_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default statusActivitySlice;
