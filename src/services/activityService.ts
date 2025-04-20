// import { ApiResponse } from '@/models/responseInterface';
import { handleError } from "@/utils/error";
import api, { api_formdata } from "./api"; // Ensure `api` is your Axios instance configured with baseURL and interceptors
import {
  ICreateActivity,
  ICreateComment,
  ICreateFile,
  ICreateFolder,
  ICreateListCodeProduct,
  ICreateListUser,
  ICreateReview,
  ICreateStatusActivity,
  ICreateStatusWork,
  ICreateTask,
  ICreateTypeActivity,
  ICreateTypeWork,
  ICreateWork,
  IUpdateActivity,
  IUpdateComment,
  IUpdateListCodeProduct,
  IUpdateListUser,
  IUpdatePictureActivity,
  IUpdatePictureWork,
  IUpdateReview,
  IUpdateStatusActivity,
  IUpdateStatusWork,
  IUpdateTask,
  IUpdateTypeActivity,
  IUpdateTypeWork,
  IUpdateWork,
} from "@/models/activityInterface";

const activityService = {
  getAllActivities: async (filters?: {
    contract?: string;
    type?: string;

    status?: string;
    project?: string;

    date_start?: string;

    date_end?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
      }
      const response = await api.get(`/activity/all?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllActivitiesReady: async (
    id: string,
    filters?: {
      group_user?: string;
      project?: string;
      contract?: string;
    }
  ) => {
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
        `/activity/activity-ready/${id}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllActivitiesReadyByUser: async (
    id: string,
    filters?: {
      group_user?: string;
      project?: string;
      contract?: string;
    }
  ) => {
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
        `/activity/activity-ready/user/${id}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorkByProject: async (project: string) => {
    try {
      const response = await api.get(`/activity/work-by-project/${project}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getAllWorksReady: async (filters?: {
    group_user?: string;
    project?: string;
    contract?: string;
  }) => {
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
        `/activity/work-ready?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorksReadyByUser: async (filters?: {
    group_user?: string;
    project?: string;
    contract?: string;
  }) => {
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
        `/activity/work-ready/user?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorksFilter: async (filters?: {
    date_start?: string;
    date_end?: string;
    contract?: string;
    type?: "week" | "month" | "year";
    export?: boolean;
  }) => {
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
        `/activity/work-filter?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorksUrgent: async (filters?: {
    group_user?: string;
    project?: string;
    contract?: string;
  }) => {
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
        `/activity/work-urgent/all?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorksUrgentByUser: async (filters?: {
    group_user?: string;
    project?: string;
    contract?: string;
  }) => {
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
        `/activity/work-urgent/user?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorksExpiredUrgent: async (filters?: {
    group_user?: string;
    project?: string;
    contract?: string;
  }) => {
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
        `/activity/work-expired-urgent/all?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllWorksExpiredUrgentByUser: async (filters?: {
    group_user?: string;
    project?: string;
    contract?: string;
  }) => {
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
        `/activity/work-expired-urgent/user?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteActivities: async (datas: string[]) => {
    try {
      const response = await api.delete(`/activity`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllYearActivities: async (year: number) => {
    try {
      const response = await api.get(`/activity/all_year?year=${year}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getActivityById: async (id: string) => {
    try {
      const response = await api.get(`/activity/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getActivityByContract: async (id: string) => {
    try {
      const response = await api.get(`/activity/contract/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getWorkByActivity: async (id: string) => {
    try {
      const response = await api.get(`/activity/work-by-activity/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createActivity: async (data: ICreateActivity) => {
    try {
      const response = await api.post("/activity/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateActivity: async (id: string, data: IUpdateActivity) => {
    try {
      const response = await api.put(`/activity/update/id/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateStatusListActivity: async (
    listActivity: { activity_id: string; status: string; position: number }[]
  ) => {
    try {
      const response = await api.put(`/activity/update/list`, listActivity);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateStatus: async (id: string, data: IUpdateActivity) => {
    try {
      const response = await api.put(`/activity/update/status/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteActivity: async (id: string) => {
    try {
      const response = await api.delete(`/activity/activities/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // ListCodeProduct Methods
  getAllListCodeProducts: async () => {
    try {
      const response = await api.get("/activity/list-code-products");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getListCodeProductById: async (id: string) => {
    try {
      const response = await api.get(`/activity/list-code-products/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createListCodeProduct: async (data: ICreateListCodeProduct) => {
    try {
      const response = await api.post("/activity/list-code-products", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateListCodeProduct: async (id: string, data: IUpdateListCodeProduct) => {
    try {
      const response = await api.put(
        `/activity/list-code-products/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteListCodeProduct: async (id: string) => {
    try {
      const response = await api.delete(`/activity/list-code-products/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // ListUser Methods
  getAllListUsers: async () => {
    try {
      const response = await api.get("/activity/list-users");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getListUserById: async (id: string) => {
    try {
      const response = await api.get(`/activity/list-users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createListUser: async (data: ICreateListUser) => {
    try {
      const response = await api.post("/activity/list-users", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateListUser: async (id: string, data: IUpdateListUser) => {
    try {
      const response = await api.put(`/activity/list-users/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteListUser: async (id: string) => {
    try {
      const response = await api.delete(`/activity/list-users/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // PictureActivity Methods
  getAllPictureActivities: async () => {
    try {
      const response = await api.get("/activity/pictures-activity");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getPictureActivityById: async (id: string) => {
    try {
      const response = await api.get(`/activity/pictures-activity/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createPictureActivity: async (data: FormData) => {
    try {
      const response = await api_formdata.post(
        "/activity/picture/create",
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updatePictureActivity: async (id: string, data: IUpdatePictureActivity) => {
    try {
      const response = await api.put(`/activity/pictures-activity/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deletePictureActivity: async (id: string) => {
    try {
      const response = await api.delete(`/activity/picture/delete?id=${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // PictureWork Methods
  getAllPictureWorks: async () => {
    try {
      const response = await api.get("/activity/pictures-work");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getPictureWorkById: async (id: string) => {
    try {
      const response = await api.get(`/activity/pictures-work/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createPictureWork: async (data: FormData) => {
    try {
      const response = await api_formdata.post(
        "/activity/pictures-work/create",
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createPictureTask: async (data: FormData) => {
    try {
      const response = await api_formdata.post(
        "/activity/pictures-task/create",
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updatePictureWork: async (id: string, data: IUpdatePictureWork) => {
    try {
      const response = await api.put(`/activity/pictures-work/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deletePictureWork: async (id: string) => {
    try {
      const response = await api.delete(
        `/activity/pictures-work/delete?id=${id}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deletePictureTask: async (id: string) => {
    try {
      const response = await api.delete(
        `/activity/pictures-task/delete?id=${id}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // TypeWork Methods
  getAllTypeWorks: async () => {
    try {
      const response = await api.get("/activity/type-work/all");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypeWorkById: async (id: string) => {
    try {
      const response = await api.get(`/activity/type-work/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFullTypeWorkById: async (id?: string) => {
    try {
      const response = await api.get(`/activity/type-work/full/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createTypeWork: async (data: ICreateTypeWork) => {
    try {
      const response = await api.post("/activity/type-work/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateTypeWork: async (id: string, data: IUpdateTypeWork) => {
    try {
      const response = await api.put(`/activity/type-work/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteTypeWork: async (id: string) => {
    try {
      const response = await api.delete(`/activity/type-work/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // StatusWork Methods
  getAllStatusWorks: async () => {
    try {
      const response = await api.get("/activity/status-work/all");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getStatusWorkById: async (id: string) => {
    try {
      const response = await api.get(`/activity/status-work/update/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createStatusWork: async (data: ICreateStatusWork) => {
    try {
      const response = await api.post("/activity/status-work/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateStatusWork: async (id: string, data: IUpdateStatusWork) => {
    try {
      const response = await api.put(
        `/activity/status-work/update/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteStatusWork: async (id: string) => {
    try {
      const response = await api.delete(`/activity/status-work/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Work Methods
  getAllWorks: async (filters?: { project?: string }) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value);
          }
        });
      }
      const response = await api.get(
        `/activity/work/all?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllYearWorks: async (year: number) => {
    try {
      const response = await api.get(`/activity/work/all_year?year=${year}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getWorkById: async (id: string) => {
    try {
      const response = await api.get(`/activity/work/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTaskkById: async (id: string) => {
    try {
      const response = await api.get(`/activity/task/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createWork: async (data: ICreateWork) => {
    try {
      const response = await api.post("/activity/work/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createTask: async (data: ICreateTask) => {
    try {
      const response = await api.post("/activity/task/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateWork: async (id: string, data: IUpdateWork) => {
    try {
      const response = await api.put(`/activity/work/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateTask: async (id: string, data: IUpdateTask) => {
    try {
      const response = await api.put(`/activity/task/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateTasks: async (tasks:IUpdateTask[]) => {
    try {
      const response = await api.put(`/activity/update-tasks`, tasks);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteWork: async (id: string) => {
    try {
      const response = await api.delete(`/activity/works/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteWorks: async (datas: string[]) => {
    try {
      const response = await api.delete(`/activity/work`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // TypeActivity Methods
  getAllTypeActivities: async () => {
    try {
      const response = await api.get("/activity/type/all");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFullTypeActivities: async () => {
    try {
      const response = await api.get("/activity/type/full");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypeActivityById: async (id: string) => {
    try {
      const response = await api.get(`/activity/type/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFullTypeActivityById: async (id?: string) => {
    try {
      const response = await api.get(`/activity/type/full/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  createTypeActivity: async (data: ICreateTypeActivity) => {
    try {
      const response = await api.post("/activity/type/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateTypeActivity: async (id: string, data: IUpdateTypeActivity) => {
    try {
      const response = await api.put(`/activity/type/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteTypeActivity: async (id: string) => {
    try {
      const response = await api.delete(`/activity/type/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // StatusActivity Methods
  getAllStatusActivities: async () => {
    try {
      const response = await api.get("/activity/status/all");
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getStatusActivityById: async (id: string) => {
    try {
      const response = await api.get(`/activity/status/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createStatusActivity: async (data: ICreateStatusActivity) => {
    try {
      const response = await api.post("/activity/status/create", data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateStatusActivity: async (id: string, data: IUpdateStatusActivity) => {
    try {
      const response = await api.put(`/activity/status/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteStatusActivity: async (id: string) => {
    try {
      const response = await api.delete(`/activity/status/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  dashboardContract: async (id: string) => {
    try {
      const response = await api.get(`/activity/dashboard-contract/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  dashboardActivity: async (id: string) => {
    try {
      const response = await api.get(`/activity/dashboard-activity/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getWorksFilter: async (filters?: {page?:number,limit?:number,status?:string,type?:string}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/activity/works-filter?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getDashboardWorksManagement: async (filters?: {type?:string}) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/activity/dashboard-management?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  createReview: async (data:ICreateReview) => {
    try {

    
      const response = await api.post(`/activity/create-review`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateReview: async (id:string,data:IUpdateReview) => {
    try {

    
      const response = await api.put(`/activity/update-review/${id}`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getReviews: async (id:string) => {
    try {

    
      const response = await api.get(`/activity/get-reviews/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  checkReview: async (id:string) => {
    try {

    
      const response = await api.get(`/activity/check-review/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  createComment: async (data:ICreateComment) => {
    try {

    
      const response = await api.post(`/activity/create-comment`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateComment: async (id:string,data:IUpdateComment) => {
    try {

    
      const response = await api.put(`/activity/update-comment/${id}`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getComments: async (id:string) => {
    try {

    
      const response = await api.get(`/activity/get-comments/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getWorksFollowActivityByProject: async (id: string) => {
    try {
      const response = await api.get(`/activity/get-works_follow_activities_by_project?id=${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createFolder: async (data:FormData) => {
    try {
      const response = await api_formdata.post(`/activity/create-folder`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateFolder: async (id:string,data:ICreateFolder) => {
    try {
      const response = await api.put(`/activity/update-folder/${id}`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createFile: async (data:FormData) => {
    try {
      const response = await api_formdata.post(`/activity/create-files`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateFile: async (id:string,data:ICreateFile) => {
    try {
      const response = await api.put(`/activity/update-file/${id}`,data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getDocumentsByProject: async (id: string) => {
    try {
      const response = await api.get(`/activity/get-documents-by-project/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

export default activityService;
