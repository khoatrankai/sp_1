import { handleError } from "@/utils/error";
import api, { api_formdata } from "./api";
import { ICreateGroupUser, IUpdateGroupUser } from "@/models/userInterface";

const userService = {
  getUsers: async () => {
    try {
      const response = await api.get(`/user/all`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get(`/user/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getUserIDAdmin: async (id: string) => {
    try {
      const response = await api.get(`/user/admin/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getUserIDAdminByUser: async () => {
    try {
      const response = await api.get(`/user/admin/user`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  loginUser: async (data: { email: string; password: string }) => {
    const response = await api.post(`/auth/login`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  sendSign: async (data: { email: string }) => {
    const response = await api.post(`/auth/send-req-sign`, data, {
      withCredentials: true,
    });
    return response.data;
  },
  logoutUser: async () => {
    const response = await api.post(`/auth/logout`);
    return response.data;
  },
  createUser: async (createUserInfo: FormData) => {
    try {
      const response = await api_formdata.post(`/user/create`, createUserInfo);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteUser: async (datas: string[]) => {
    try {
      const response = await api.delete(`/user`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateUser: async (id: string, updateUserInfo: FormData) => {
    try {
      const response = await api_formdata.put(
        `/user/update/${id}`,
        updateUserInfo
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateUserProfile: async (updateUserInfo: FormData) => {
    try {
      const response = await api_formdata.put(
        `/user/update-profile`,
        updateUserInfo
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updatePasswordUser: async (data?: {
    old_password: string;
    new_password: string;
    again_password: string;
  }) => {
    try {
      const response = await api.put(`/user/update-password`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getCategoryRoleFull: async () => {
    try {
      const response = await api.get(`/user/category-role-full`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getRoleUserFullByID: async (id: string) => {
    try {
      const response = await api.get(`/user/get-full-role-user-id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getRoleUserFullByUser: async () => {
    try {
      const response = await api.get(`/user/get-full-role-user`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getRoleUserFullByAccess: async () => {
    try {
      const response = await api.get(`/user/get-full-role-user-access/`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateRoleUserFullByID: async (id: string, data: string[]) => {
    try {
      const response = await api.post(`/user/full-role-user-id/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  updateGroupRole: async (id: string, data: string[]) => {
    try {
      const response = await api.put(`/user/group-role/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getRoleByGroup: async (id: string) => {
    try {
      const response = await api.get(`/user/group-role/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getGroupUser: async () => {
    try {
      const response = await api.get(`/user/get-group-user`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getNotifyUser: async (page: number, limit: number) => {
    try {
      const response = await api.get(
        `/user/get-notify?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateNotifyUser: async (notify_user_id?: string) => {
    try {
      if (notify_user_id) {
        const response = await api.put(`/user/update-notify/${notify_user_id}`);
        return response.data;
      } else {
        const response = await api.put(`/user/update-all-notify`);
        return response.data;
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getCountNotifyUser: async () => {
    try {
      const response = await api.get(`/user/get-count-notify`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createGroupUser: async (data: ICreateGroupUser) => {
    try {
      const response = await api.post(`/user/create-group-user`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateGroupUser: async (group_id: string, data: IUpdateGroupUser) => {
    try {
      const response = await api.put(
        `/user/update-group-user/${group_id}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getFilterUser: async (filters?: { group?: string }) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get(
        `/user/get-user-filter?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTimeKeeping: async (filters?: { group?: string,user_id?:string }) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get(
        `/user/timekeeping?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTimeKeepingPerson: async (data: { start_time: number,user_id:string,end_time:number }) => {
    try {
      const queryParams = new URLSearchParams();

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await api.get(
        `/user/timekeeping-person?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createTimeKeeping: async ()=>{
    try {


      const response = await api.post(
        `/user/timekeeping`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  checkTimeKeeping: async ()=>{
    try {
      const response = await api.get(
        `/user/check-timekeeping`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

export default userService;
