
import { IGetSourcesOpportunityDto } from '@/models/opportunityInterface';
import { DataStateRedux } from '@/models/responseInterface';
import opportunityService from '@/services/opportunityService.';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state for sources opportunity
const initialState: DataStateRedux<IGetSourcesOpportunityDto[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Async thunk to fetch sources opportunity data
export const fetchSourcesOpportunity = createAsyncThunk(
  'sourcesOpportunity/fetchSourcesOpportunity',
  async (_, thunkAPI) => {
    try {
      const sources = await opportunityService.getSourcesOpportunity();
      return sources; // Return result from API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch sources opportunity');
    }
  }
);

const sourcesOpportunitySlice = createSlice({
  name: 'sources_opportunity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSourcesOpportunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSourcesOpportunity.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchSourcesOpportunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default sourcesOpportunitySlice;
