import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import activityService from '@/services/activityService';
import { IGetStatusWork, ICreateStatusWork, IUpdateStatusWork } from '@/models/activityInterface';

const initialState: DataStateRedux<IGetStatusWork[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchStatusWork = createAsyncThunk(
  'statusWork/fetchStatusWork',
  async (_, thunkAPI) => {
    try {
      const response = await activityService.getAllStatusWorks();
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch Status activities');
    }
  }
);

export const createStatusWork = createAsyncThunk(
  'statusWork/createStatusWork',
  async (data: ICreateStatusWork, thunkAPI) => {
    try {
      const response = await activityService.createStatusWork(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create Status activity');
    }
  }
);

export const updateStatusWork = createAsyncThunk(
  'statusWork/updateStatusWork',
  async ({ Status_id, data }: { Status_id: string; data: IUpdateStatusWork }, thunkAPI) => {
    try {
      const response = await activityService.updateStatusWork(Status_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update Status activity');
    }
  }
);

const statusWorkSlice = createSlice({
  name: 'statusWork',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatusWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusWork.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchStatusWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStatusWork.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateStatusWork.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.status_work_id === action.payload.data.status_work_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default statusWorkSlice;
