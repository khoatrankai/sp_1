import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import opportunityService from "@/services/opportunityService.";
import { IGetDashboardOpportunityDto } from "@/models/opportunityInterface";

// Define the initial state using DataStateRedux with IGetOpportunitiesDto
const initialState: DataStateRedux<IGetDashboardOpportunityDto[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk for fetching opportunities data
export const fetchDashboardOpportunities = createAsyncThunk(
  "opportunity/fetchDashboardOpportunities",
  async (
    filter: {start_year?:number,end_year?:number},
    thunkAPI
  ) => {
    try {
      const opportunities = await opportunityService.getOpportunityFilterByType(filter);
      return opportunities;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch opportunities");
    }
  }
);

const dashboardAllOpportunitySlice = createSlice({
  name: "opportunity_dashboard_all",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardOpportunities.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        } else {
          state.loading = false;
          state.error = "Unexpected status code";
        }
      })
      .addCase(fetchDashboardOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default dashboardAllOpportunitySlice;
