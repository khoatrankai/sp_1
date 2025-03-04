import { handleError } from "@/utils/error";
import api, { api_formdata } from "../api";

const customerService = {
  getProfileCustomer: async () => {
    try {
      const response = await api.get(`/customer/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  loginCustomer: async (data: { email: string; password: string }) => {
    const response = await api.post(`/auth/login-customer`, data, {
      withCredentials: true,
    });
    return response.data;
  },
  logoutCustomer: async () => {
    const response = await api.post(`/auth/logout-customer`);
    return response.data;
  },
  updatePasswordCustomer: async (data?: {
    old_password: string;
    new_password: string;
    again_password: string;
  }) => {
    try {
      const response = await api.put(`/customer/update-password`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateAccountCustomerProfile: async (data: FormData) => {
    try {
      const response = await api_formdata.put(
        `/customer/update-account-customer-profile`,
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllCustomerByToken: async () => {
    try {
      const response = await api.get(`/customer/get-all-customer-by-token`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllProjectByToken: async () => {
    try {
      const response = await api.get(`/project/all-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllPriceQuoteByToken: async () => {
    try {
      const response = await api.get(`/price_quote/all-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllContractByToken: async () => {
    try {
      const response = await api.get(`/contract/all-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getAllPaymentByToken: async () => {
    try {
      const response = await api.get(`/contract/all-payment-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

export default customerService;
