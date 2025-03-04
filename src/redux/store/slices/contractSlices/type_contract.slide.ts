import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import { ICreateTypeContract, IGetTypeContract, IUpdateTypeContract } from '@/models/contractInterface';
import contractService from '@/services/contractService.';

const initialState: DataStateRedux<IGetTypeContract[]> = {
  datas: [],
  loading: false,
  error: null,
};


export const fetchTypeContracts = createAsyncThunk(
  'typeContract/fetchTypeContracts',
  async (_, thunkAPI) => {
    try {
      const response = await contractService.getTypeContracts();
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch type contracts');
    }
  }
);

export const createTypeContract = createAsyncThunk(
  'typeContract/createTypeContract',
  async (data: ICreateTypeContract, thunkAPI) => {
    try {
      const response = await contractService.createTypeContract(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create type contract');
    }
  }
);

export const updateTypeContract = createAsyncThunk(
  'typeContract/updateTypeContract',
  async ({ id, data }: { id: string; data: IUpdateTypeContract }, thunkAPI) => {
    try {
      const response = await contractService.updateTypeContract(id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update type contract');
    }
  }
);

const typeContractSlice = createSlice({
  name: 'typeContract',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypeContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTypeContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchTypeContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTypeContract.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateTypeContract.fulfilled, (state, action) => {
        const index = state.datas.findIndex((item) => item.type_id === action.payload.data.type_id);
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default typeContractSlice;
