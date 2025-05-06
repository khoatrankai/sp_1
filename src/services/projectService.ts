import { handleError } from "@/utils/error";
import api, { api_formdata } from "./api";
import { ICreateNotify } from "@/models/projectInterface";

const projectService = {
  createProject: async (data: FormData) => {
    try {
      const response = await api_formdata.post(`/project`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProjects: async (filters?: { customer?: string,type_project?:string,status?:string,page?:number,limit?:number }) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/project/all?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProjectAbout: async () => {
    try {
      const response = await api.get(`/project/about`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProject: async (id: string) => {
    try {
      const response = await api.get(`/project/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFullProject: async (id: string) => {
    try {
      const response = await api.get(`/project/get-full-project/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProjectsFilter: async (filter?:{type?:string,page?:number,limit?:number,user?:string,status?:string}) => {
  

    try {
      const queryParams = new URLSearchParams();

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/project/get-projects-filter?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateProject: async (id: string, data: FormData) => {
    try {
      const response = await api_formdata.put(`/project/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteProject: async (datas: string[]) => {
    try {
      const response = await api.delete(`/project`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypes: async () => {
    try {
      const response = await api.get(`/project/type`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypeFulls: async (filter?:{status?:string}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/project/type-full?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createType: async (data: { name_type: string }) => {
    const res = await api.post("/project/type", data);
    if (!res) {
      throw new Error("Failed to create type project: No response");
    }
    return res.data;
  },
  updateType: async (type_id: string, data: { name_type: string }) => {
    const res = await api.put(`/project/type/${type_id}`, data);
    if (!res) {
      throw new Error("Failed to update unit project: No response");
    }
    return res.data;
  },
  dashboardProject: async () => {
    try {
      const response = await api_formdata.get(`/project/dashboard-project`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getDashboardProjectManagement: async (filters?: {type_project?:string}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/project/get-dashboard-management?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProjectsByType: async(id:string)=>{
    try {
      const response = await api.get(`/project/get-projects-by-type/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getNotifies: async(id:string)=>{
    try {
      const response = await api.get(`/project/get-notifies/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createNotify: async(data:ICreateNotify)=>{
    try {
      const response = await api.post(`/project/create-notify`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

export default projectService;
