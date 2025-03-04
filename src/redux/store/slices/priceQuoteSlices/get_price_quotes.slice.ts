import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import { FilterPriceQuote, IGetPriceQuote } from '@/models/priceQuoteInterface';
import priceQuoteService from '@/services/priceQuoteService';

// Define the initial state using DataStateRedux with IGetOpportunitiesDto
const initialState: DataStateRedux<IGetPriceQuote[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk for fetching opportunities data
export const fetchPriceQuotes = createAsyncThunk(
  'pricequote/fetchPriceQuotes',
  async (filters:FilterPriceQuote, thunkAPI) => {
    try {
      const data = await priceQuoteService.getPriceQuotes(filters);
      return data;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch opportunities');
    }
  }
);

const priceQuoteSlice = createSlice({
  name: 'pricequote',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceQuotes.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        } else {
          state.loading = false;
          state.error = 'Unexpected status code';
        }
      })
      .addCase(fetchPriceQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default priceQuoteSlice;
