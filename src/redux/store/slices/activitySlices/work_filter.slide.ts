import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import { IGetWork2 } from "@/models/activityInterface";
import activityService from "@/services/activityService";

const initialState: DataStateRedux<IGetWork2[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchWorksFilter = createAsyncThunk(
  "work/fetchWorksFilter",
  async (
    filter:
      | {
          date_start?: string;
          date_end?: string;
          contract?: string;
          type?: "week" | "month" | "year";
          export?: boolean;
        }
      | undefined,
    thunkAPI
  ) => {
    try {
      const response = await activityService.getAllWorksFilter(filter);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch payments");
    }
  }
);

const workFilterSlice = createSlice({
  name: "work-filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorksFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorksFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchWorksFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default workFilterSlice;
