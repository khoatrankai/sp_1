

import { IRoleProject } from '@/models/projectInterface';
import projectService from '@/services/projectService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ProjectState {
  datas: IRoleProject[]; // Định nghĩa kiểu cho dữ liệu trả về của `project type`
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
export const fetchProjectRoles = createAsyncThunk(
  'project/fetchProjectRoles',
  async (_, thunkAPI) => {
    try {
      const roles = await projectService.getRoles();
      return roles; // Trả về kết quả từ API
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch project roles');
    }
  }
);

const roleProjectSlice = createSlice({
  name: 'role_project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectRoles.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.loading = false;
          state.datas = action.payload.data;
        }
      })
      .addCase(fetchProjectRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default roleProjectSlice;
