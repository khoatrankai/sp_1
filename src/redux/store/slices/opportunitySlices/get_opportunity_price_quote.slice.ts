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
export const fetchOpportunitiesHavePriceQuote = createAsyncThunk(
  "opportunity/fetchOpportunitiesHavePriceQuote",
  async (
    _,
    thunkAPI
  ) => {
    try {
      const opportunities = await opportunityService.getOpportunityByPriceQuote();
      return opportunities;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch opportunities");
    }
  }
);

const opportunityByPriceQuoteSlice = createSlice({
  name: "opportunity_price_quote_all",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunitiesHavePriceQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunitiesHavePriceQuote.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        } else {
          state.loading = false;
          state.error = "Unexpected status code";
        }
      })
      .addCase(fetchOpportunitiesHavePriceQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default opportunityByPriceQuoteSlice;
