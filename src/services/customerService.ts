import {
  CreateGroupCustomer,
  IUpdateCustomerInfo,
  UpdateGroupCustomer,
} from "@/models/customerInterface";
import api, { api_formdata } from "./api";
import { handleError } from "@/utils/error";

const customerService = {
  getAllCustomer: async () => {
    try {
      const response = await api.get(
        `/customer/get-all-customer?limit=0&page=0`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAboutCustomer: async () => {
    try {
      const response = await api.get(`/customer/get-about-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getChartCustomer: async () => {
    try {
      const response = await api.get(`/customer/get-customer-dashboard`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFilterCustomer: async (filters?: {
    group?: string;
    time_first?: number;
    time_end?: number;
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
        `/customer/get-customer-filter?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getGroupCustomer: async () => {
    try {
      const response = await api.get(`/customer/get-group-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getCustomerID: async (info_id: string) => {
    try {
      const response = await api.get(
        `/customer/get-customer-id?info_id=${info_id}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createInfoCustomer: async (data: FormData) => {
    try {
      const response = await api_formdata.post(
        `/customer/create-customer-info`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createAccountCustomer: async (data: FormData) => {
    try {
      const response = await api_formdata.post(
        `/customer/create-account-customer`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllAccountCustomer: async (filters?: { customer_info?: string }) => {
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
        `/customer/get-all-account-customer?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getIDAccountCustomer: async (id: string) => {
    try {
      const response = await api.get(`/customer/get-id-account-customer/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateAccountCustomer: async (id: string, data: FormData) => {
    try {
      const response = await api_formdata.put(
        `/customer/update-account-customer/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteInfoCustomer: async (datas: string[]) => {
    try {
      const response = await api.delete(`/customer/customer-info`, {
        data: datas,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createGroupCustomer: async (data: CreateGroupCustomer) => {
    try {
      const response = await api.post(`/customer/create-group-customer`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateGroupCustomer: async (group_id: string, data: UpdateGroupCustomer) => {
    try {
      const response = await api.put(
        `/customer/update-group-customer/${group_id}`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  updateStatusCustomer: async (data: IUpdateCustomerInfo) => {
    const res = await api.put("/customer/update-status-customer", data);
    return res.data;
  },
  updateCustomerInfo: async (data: FormData) => {
    console.log(data);
    const res = await api_formdata.put("/customer/update-customer-info", data);
    return res.data;
  },
};

export default customerService;
