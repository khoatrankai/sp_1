import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IGetOpportunitiesDto } from "@/models/opportunityInterface";
import { DataStateRedux } from "@/models/responseInterface";
import opportunityService from "@/services/opportunityService.";

// Define the initial state using DataStateRedux with IGetOpportunitiesDto
const initialState: DataStateRedux<IGetOpportunitiesDto[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk for fetching opportunities data
export const fetchOpportunities = createAsyncThunk(
  "opportunity/fetchOpportunities",
  async (
    filter: {
      type_opportunity?: string;

      type_source?: string;

      user_support?: string;

      status?: string;

      date_start?: string;

      date_end?: string;
    },
    thunkAPI
  ) => {
    try {
      const opportunities = await opportunityService.getOpportunities(filter);
      return opportunities;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch opportunities");
    }
  }
);

const opportunitySlice = createSlice({
  name: "opportunity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        } else {
          state.loading = false;
          state.error = "Unexpected status code";
        }
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default opportunitySlice;
