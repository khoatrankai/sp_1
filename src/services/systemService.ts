import { handleError } from "@/utils/error";
import api from "./api";
import {
  LinkSystem,
  Profit,
  TargetRevenue,
  Vat,
} from "@/models/systemInterface";

const systemService = {
  getProvinces: async () => {
    try {
      const response = await api.get(`/system/provinces`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getVats: async () => {
    try {
      const response = await api.get(`/system/vats`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getVat: async (id: string) => {
    try {
      const response = await api.get(`/system/vat/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createVat: async (data: Vat) => {
    try {
      const response = await api.post(`/system/create-vat`, {
        type_vat: data.type_vat,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateVat: async (id: string, updateVat: Vat) => {
    try {
      const response = await api.put(`/system/update-vat/${id}`, updateVat);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProfits: async () => {
    try {
      const response = await api.get(`/system/profits`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getProfit: async (id: string) => {
    try {
      const response = await api.get(`/system/profit/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createProfit: async (data: Profit) => {
    try {
      const response = await api.post(`/system/create-profit`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateProfit: async (id: string, data: Profit) => {
    try {
      const response = await api.put(`/system/profit/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTargets: async () => {
    try {
      const response = await api.get(`/system/targets_revenue`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTarget: async (id: string) => {
    try {
      const response = await api.get(`/system/target_revenue/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTargetYear: async () => {
    try {
      const response = await api.get(`/system/target_revenue_year`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createTarget: async (data: TargetRevenue) => {
    try {
      const response = await api.post(`/system/target_revenue`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateTarget: async (id: string, data: TargetRevenue) => {
    try {
      const response = await api.put(`/system/target_revenue/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getLinksSystem: async () => {
    try {
      const response = await api.get(`/system/links_system`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getLinkSystem: async (id: string) => {
    try {
      const response = await api.get(`/system/link_system/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createLinkSystem: async (data: LinkSystem) => {
    try {
      const response = await api.post(`/system/link_system`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateLinkSystem: async (id: string, data: LinkSystem) => {
    try {
      const response = await api.put(`/system/link_system/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

export default systemService;
