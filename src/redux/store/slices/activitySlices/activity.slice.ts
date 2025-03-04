import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import {
  ICreateActivity,
  IGetActivity,
  IUpdateActivity,
} from "@/models/activityInterface";
import activityService from "@/services/activityService";

const initialState: DataStateRedux<IGetActivity[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async (
    filter: {
      contract?: string;
      type?: string;

      status?: string;
      project?: string;

      date_start?: string;

      date_end?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await activityService.getAllActivities(filter);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch activities");
    }
  }
);

export const fetchYearActivities = createAsyncThunk(
  "activity/fetchYearActivities",
  async (year: number, thunkAPI) => {
    try {
      const response = await activityService.getAllYearActivities(year);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch activities");
    }
  }
);

export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async (data: ICreateActivity, thunkAPI) => {
    try {
      const response = await activityService.createActivity(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create activity");
    }
  }
);

export const updateActivity = createAsyncThunk(
  "activity/updateActivity",
  async (
    { activity_id, data }: { activity_id: string; data: IUpdateActivity },
    thunkAPI
  ) => {
    try {
      const response = await activityService.updateActivity(activity_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update activity");
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchYearActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchYearActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.activity_id === action.payload.data.activity_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default activitySlice;
