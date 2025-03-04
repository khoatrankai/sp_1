import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import activityService from "@/services/activityService";
import { IGetWork, ICreateWork, IUpdateWork } from "@/models/activityInterface";

const initialState: DataStateRedux<IGetWork[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchWorks = createAsyncThunk(
  "work/fetchWorks",
  async (filters: { project: string } | undefined, thunkAPI) => {
    try {
      const response = await activityService.getAllWorks(filters);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch works");
    }
  }
);

export const fetchYearWorks = createAsyncThunk(
  "work/fetchYearWorks",
  async (year: number, thunkAPI) => {
    try {
      const response = await activityService.getAllYearWorks(year);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch works");
    }
  }
);

export const createWork = createAsyncThunk(
  "work/createWork",
  async (data: ICreateWork, thunkAPI) => {
    try {
      const response = await activityService.createWork(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create work");
    }
  }
);

export const updateWork = createAsyncThunk(
  "work/updateWork",
  async (
    { work_id, data }: { work_id: string; data: IUpdateWork },
    thunkAPI
  ) => {
    try {
      const response = await activityService.updateWork(work_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update work");
    }
  }
);

const workSlice = createSlice({
  name: "work",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchYearWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchYearWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createWork.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateWork.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.work_id === action.payload.data.work_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default workSlice;
