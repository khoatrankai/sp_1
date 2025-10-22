import { handleError } from "@/utils/error";
import api, { api_formdata } from "./api";
import {  CreateChat, CreateChatGroup, ICreateContractor, ICreateNotify, IRoleProject } from "@/models/projectInterface";

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
  deleteType: async (datas: string[]) => {
    try {
      const response = await api.delete(`/project/type`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteContent: async (datas: string[]) => {
    try {
      const response = await api.delete(`/project/contents-chat`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
   deleteContentGroup: async (datas: string[]) => {
    try {
      const response = await api.delete(`/project/contents-group-chat`, { data: datas });
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
  },
     createContractor: async (data: ICreateContractor) => {
      const res = await api.post("/project/contractor", data);
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      return res.data;
    },
    updateContractor: async (id:string,data: ICreateContractor) => {
      const res = await api.put(`/project/contractor/${id}`, data);
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      return res.data;
    },
  
    getContractors: async () => {
      const res = await api.get("/project/contractors");
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      return res.data;
    },
     getContractorsByProject: async (id:string) => {
      const res = await api.get(`/project/contractors-by-project/${id}`);
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      return res.data;
    },
  
    getContractorByID: async (id:string) => {
      const res = await api.get(`/project/contractor/${id}`);
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      return res.data;
    },
    getChats: async (id:string) => {
    try {
      const res = await api.get(`/project/chat/${id}`);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  getChatsByUser: async () => {
    try {
      const res = await api.get(`/project/chat-all`);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  getChatGroups: async (id:string) => {
    try {
      const res = await api.get(`/project/chat-group/${id}`);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  getContentChats: async (id:string) => {
    try {
      const res = await api.get(`/project/contents-chat/${id}`);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  getContentGroupChats: async (id:string) => {
    try {
      const res = await api.get(`/project/contents-group-chat/${id}`);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  getUsersByProject: async (id:string) => {
    try {
      const res = await api.get(`/project/users/${id}`);
      if (!res) {
        throw new Error("Failed to get users: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  createChat: async (data:CreateChat) => {
    try {
      const res = await api.post(`/project/chat`,data);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  deleteChat: async (data:string[]) => {
    try {
      const res = await api.delete(`/project/chat`,{data:data});
      if (!res) {
        throw new Error("Failed to delete chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  deleteChatGroup: async (data:string[]) => {
    try {
      const res = await api.delete(`/project/chat-group`,{data:data});
      if (!res) {
        throw new Error("Failed to delete chat group: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  deleteMemberChatGroup: async (chat_group:string) => {
    try {
      const res = await api.delete(`/project/member-chat-group`,{data:{chat_group}});
      if (!res) {
        throw new Error("Failed to delete chat group: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  createContentChats: async (data:FormData) => {
    try {
      const res = await api_formdata.post(`/project/contents-chat`,data);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  createContentGroupChats: async (data:FormData) => {
    try {
      const res = await api_formdata.post(`/project/contents-group-chat`,data);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  createChatGroup: async (data:CreateChatGroup) => {
    try {
      const res = await api.post(`/project/chat-group`,data);
      if (!res) {
        throw new Error("Failed to get chat: No response");
      }
      return res.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
    
    
  },
  getRoles: async () => {
    try {
      const response = await api.get(`/project/role`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteRole: async (datas: string[]) => {
    try {
      const response = await api.delete(`/project/role`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createRole: async (data: IRoleProject) => {
    const res = await api.post("/project/role", data);
    if (!res) {
      throw new Error("Failed to create type project: No response");
    }
    return res.data;
  },
  updateRole: async (role_id: string, data: IRoleProject) => {
    const res = await api.put(`/project/role/${role_id}`, data);
    if (!res) {
      throw new Error("Failed to update unit project: No response");
    }
    return res.data;
  },
};

export default projectService;
