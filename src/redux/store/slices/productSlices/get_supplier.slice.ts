import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataStateRedux } from '@/models/responseInterface';
import productService from '@/services/productService';
import { ICreateSupplierProduct, IGetSupplierProduct, IUpdateSupplierProduct } from '@/models/productInterface';

const initialState: DataStateRedux<IGetSupplierProduct[]> = {
  datas: [],
  loading: false,
  error: null,
};

export const fetchSuppliers = createAsyncThunk(
  'supplier/fetchSuppliers',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getAllSuppliers();
      console.log(response)
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch suppliers');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'supplier/createSupplier',
  async (data: ICreateSupplierProduct, thunkAPI) => {
    try {
      const response = await productService.createSupplier(data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to create supplier');
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'supplier/updateSupplier',
  async ({ supplier_id, data }: { supplier_id: string; data: IUpdateSupplierProduct }, thunkAPI) => {
    try {
      const response = await productService.updateSupplier(supplier_id, data);
      return response;
    } catch {
      return thunkAPI.rejectWithValue('Failed to update supplier');
    }
  }
);

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.datas = action.payload.data;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.datas.push(action.payload.data);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.datas.findIndex(
          (item) => item.supplier_id === action.payload.data.supplier_id
        );
        if (index !== -1) {
          state.datas[index] = action.payload.data;
        }
      });
  },
}).reducer;

export default supplierSlice;
