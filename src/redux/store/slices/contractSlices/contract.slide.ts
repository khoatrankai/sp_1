import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DataStateRedux } from "@/models/responseInterface";
import {
  ICreateContract,
  IGetContract,
  IUpdateContract,
} from "@/models/contractInterface";
import contractService from "@/services/contractService.";

const initialState: DataStateRedux<IGetContract[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchContracts = createAsyncThunk(
  "contract/fetchContracts",
  async (filter: { year?: number; customer?: string } | null, thunkAPI) => {
    try {
      if (filter) {
        const response = await contractService.getYearContracts(filter);
        return response;
      }
      const response = await contractService.getContracts();
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch contracts");
    }
  }
);

export const createContract = createAsyncThunk(
  "contract/createContract",
  async (data: ICreateContract, thunkAPI) => {
    try {
      const response = await contractService.createContract(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to create contract");
    }
  }
);

export const updateContract = createAsyncThunk(
  "contract/updateContract",
  async ({ id, data }: { id: string; data: IUpdateContract }, thunkAPI) => {
    try {
      const response = await contractService.updateContract(id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update contract");
    }
  }
);

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.contract_id === action.payload.data.contract_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default contractSlice;
