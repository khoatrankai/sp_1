
import { ITypeProject } from '@/models/projectInterface';
import projectService from '@/services/projectService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProjectState {
  datas: ITypeProject[]; // Định nghĩa kiểu cho dữ liệu trả về của `project type`
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: ProjectState = {
  datas: [],
  loading: false,
  error: null,
};

// Sử dụng createAsyncThunk để tạo action async gọi API
export const fetchProjectTypeFulls = createAsyncThunk(
  'project/fetchProjectTypeFulls',
  async (_, thunkAPI) => {
    try {
      const types = await projectService.getTypeFulls();
      return types; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch project types');
    }
  }
);

const typeFullProjectSlice = createSlice({
  name: 'type_full_project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTypeFulls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTypeFulls.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchProjectTypeFulls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default typeFullProjectSlice;
