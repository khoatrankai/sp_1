import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import { ICreateListCodeProduct, IGetListCodeProduct, IUpdateListCodeProduct } from '@/models/activityInterface';
import activityService from '@/services/activityService';

const initialState: DataStateRedux<IGetListCodeProduct[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchListCodeProducts = createAsyncThunk(
  'listCodeProduct/fetchListCodeProducts',
  async (_, thunkAPI) => {
    try {
      const response = await activityService.getAllListCodeProducts();
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch list code products');
    }
  }
);

export const createListCodeProduct = createAsyncThunk(
  'listCodeProduct/createListCodeProduct',
  async (data: ICreateListCodeProduct, thunkAPI) => {
    try {
      const response = await activityService.createListCodeProduct(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create list code product');
    }
  }
);

export const updateListCodeProduct = createAsyncThunk(
  'listCodeProduct/updateListCodeProduct',
  async ({ list_id, data }: { list_id: string; data: IUpdateListCodeProduct }, thunkAPI) => {
    try {
      const response = await activityService.updateListCodeProduct(list_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update list code product');
    }
  }
);

const listCodeActivityProductSlice = createSlice({
  name: 'listCodeProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListCodeProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListCodeProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchListCodeProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createListCodeProduct.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateListCodeProduct.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.list_id === action.payload.data.list_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default listCodeActivityProductSlice;
