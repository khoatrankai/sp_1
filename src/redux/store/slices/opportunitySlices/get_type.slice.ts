
import { IGetTypeOpportunitiesDto } from '@/models/opportunityInterface';
import { DataStateRedux } from '@/models/responseInterface';
import opportunityService from '@/services/opportunityService.';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// Khởi tạo state ban đầu
const initialState: DataStateRedux<IGetTypeOpportunitiesDto[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchOpportunityTypes = createAsyncThunk(
  'opportunity/fetchOpportunityTypes',
  async (_, thunkAPI) => {
    try {
      const types = await opportunityService.getTypeOpportunity();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch types');
    }
  }
);

const typeOpportunitySlice = createSlice({
  name: 'type_opportunity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunityTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunityTypes.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchOpportunityTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default typeOpportunitySlice;
