import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import activityService from '@/services/activityService';
import { ICreateTypeWork, IGetTypeWork, IUpdateTypeWork } from '@/models/activityInterface';

const initialState: DataStateRedux<IGetTypeWork[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchTypeWork = createAsyncThunk(
  'typeWork/fetchTypeWork',
  async (_, thunkAPI) => {
    try {
      const response = await activityService.getAllTypeWorks();
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch type Work');
    }
  }
);

export const createTypeWork = createAsyncThunk(
  'typeWork/createTypeWork',
  async (data: ICreateTypeWork, thunkAPI) => {
    try {
      const response = await activityService.createTypeWork(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create type Work');
    }
  }
);

export const updateTypeWork = createAsyncThunk(
  'typeWork/updateTypeWork',
  async ({ type_id, data }: { type_id: string; data: IUpdateTypeWork }, thunkAPI) => {
    try {
      const response = await activityService.updateTypeWork(type_id, data);
      return response; 
    } catch {
      return thunkAPI.rejectWithValue('Failed to update type Work');
    }
  }
);

const typeWorkSlice = createSlice({
  name: 'typeWork',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeWork.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchTypeWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTypeWork.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateTypeWork.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.type_work_id === action.payload.data.type_work_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default typeWorkSlice;
