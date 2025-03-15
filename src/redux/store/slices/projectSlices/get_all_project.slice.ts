import { IGetProject } from "@/models/projectInterface"; // Replace with your actual path
import { DataStateRedux } from "@/models/responseInterface";
import projectService from "@/services/projectService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial State
const initialState: DataStateRedux<IGetProject[]> = {
  datas: [],
  loading: false,
  error: null,
};

// Async Thunk for Fetching Projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (filters: { customer?: string,type?:string } | undefined, thunkAPI) => {
    try {
      const response = await projectService.getProjects(filters); // Replace with actual API call
      return response; // Return data from API
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch projects");
    }
  }
);

// Slice Definition
const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.datas = action.payload.data; // Ensure this aligns with your API response structure
          state.loading = false;
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
}).reducer;

export default projectsSlice;
