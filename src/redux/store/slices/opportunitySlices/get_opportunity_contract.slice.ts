import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import opportunityService from "@/services/opportunityService.";
import { IGetOpportunitiesDto } from "@/models/opportunityInterface";

// Define the initial state using DataStateRedux with IGetOpportunitiesDto
const initialState: DataStateRedux<IGetOpportunitiesDto[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk for fetching opportunities data
export const fetchOpportunitiesHaveContract = createAsyncThunk(
  "opportunity/fetchOpportunitiesHaveContract",
  async (
    filter: {start_year?:number,end_year?:number} | undefined,
    thunkAPI
  ) => {
    try {
      const opportunities = await opportunityService.getOpportunityHaveContract(filter);
      return opportunities;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch opportunities");
    }
  }
);

const opportunityHaveContractSlice = createSlice({
  name: "opportunity_have_contract",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunitiesHaveContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunitiesHaveContract.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        } else {
          state.loading = false;
          state.error = "Unexpected status code";
        }
      })
      .addCase(fetchOpportunitiesHaveContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default opportunityHaveContractSlice;
