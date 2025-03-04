import { ICreateTypeMethod, IGetTypeMethod } from '@/models/contractInterface';
import { DataStateRedux } from '@/models/responseInterface';
import contractService from '@/services/contractService.';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the initial state
const initialState: DataStateRedux<IGetTypeMethod[]> = {
  datas: [],
  loading: false,
  error: null,
};

// **Async Thunks**

// Fetch all type methods
export const fetchTypeMethods = createAsyncThunk(
  'typeMethod/fetchTypeMethods',
  async (_, thunkAPI) => {
    try {
      const typeMethods = await contractService.getAllTypeMethods();
      return typeMethods;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch type methods');
    }
  }
);

// Create a new type method
export const createTypeMethod = createAsyncThunk(
  'typeMethod/createTypeMethod',
  async (data: ICreateTypeMethod, thunkAPI) => {
    try {
      const newTypeMethod = await contractService.createTypeMethod(data);
      return newTypeMethod;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create type method');
    }
  }
);

// Update an existing type method
export const updateTypeMethod = createAsyncThunk(
  'typeMethod/updateTypeMethod',
  async (params: { id: string; data: { name: string } }, thunkAPI) => {
    try {
      const updatedTypeMethod = await contractService.updateTypeMethod(params.id, params.data);
      return updatedTypeMethod;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update type method');
    }
  }
);

// **Slice**

const typeMethodSlice = createSlice({
  name: 'typeMethod',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTypeMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeMethods.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.datas = action.payload.data;
          state.loading = false;
        } else {
          state.loading = false;
          state.error = 'Unexpected status code';
        }
      })
      .addCase(fetchTypeMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createTypeMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTypeMethod.fulfilled, (state, action) => {
        if (action.payload.statusCode === 201) {
          state.datas.push(action.payload.data);
          state.loading = false;
        } else {
          state.loading = false;
          state.error = 'Unexpected status code';
        }
      })
      .addCase(createTypeMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateTypeMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTypeMethod.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          const index = state.datas.findIndex((item) => item.type_method_id === action.payload.data.type_method_id);
          if (index !== -1) {
            state.datas[index] = action.payload.data;
          }
          state.loading = false;
        } else {
          state.loading = false;
          state.error = 'Unexpected status code';
        }
      })
      .addCase(updateTypeMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default typeMethodSlice;
