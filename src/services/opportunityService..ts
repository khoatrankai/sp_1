import {
  ICreateOpportunitiesDto,
  ICreateOpportunitySourcesDto,
  ICreateTypeOpportunitiesDto,
  IUpdateOpportunitiesDto,
  IUpdateTypeOpportunitiesDto,
} from "@/models/opportunityInterface";
import api from "./api";
import { handleError } from "@/utils/error";

const opportunityService = {
  getTypeOpportunity: async () => {
    try {
      const response = await api.get(`/opportunity/type`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypeFullOpportunity: async () => {
    try {
      const response = await api.get(`/opportunity/type-full`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getOpportunities: async (filters?: {
    type_opportunity?: string;

    type_source?: string;

    user_support?: string;

    status?: string;

    date_start?: string;

    date_end?: string;
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
        `/opportunity/all?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteOpportunities: async (datas: string[]) => {
    try {
      const response = await api.delete(`/opportunity`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getOpportunity: async (id: string) => {
    try {
      const response = await api.get(`/opportunity/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getOpportunityDashboardStatus: async () => {
    try {
      const response = await api.get(`/opportunity/dashboard-status`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFilterOpportunity: async (filters?: {
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
        `/opportunity/get-opportunity-filter?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getSourcesOpportunity: async () => {
    try {
      const response = await api.get(`/opportunity/source`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getSourcesFullOpportunity: async () => {
    try {
      const response = await api.get(`/opportunity/source-full`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createOpportunity: async (data: ICreateOpportunitiesDto) => {
    try {
      const response = await api.post(`/opportunity`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createTypeOpportunity: async (data: ICreateTypeOpportunitiesDto) => {
    try {
      const response = await api.post(`/opportunity/type`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createSourceOpportunity: async (data: ICreateOpportunitySourcesDto) => {
    try {
      const response = await api.post(`/opportunity/source`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateOpportunity: async (id: string, data: IUpdateOpportunitiesDto) => {
    try {
      const response = await api.put(`/opportunity/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateTypeOpportunity: async (
    id: string,
    data: IUpdateTypeOpportunitiesDto
  ) => {
    try {
      const response = await api.put(`/opportunity/type/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  updateSourceOpportunity: async (id: string, data: string) => {
    try {
      const response = await api.put(`/opportunity/source/${id}`, {
        name: data,
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getOpportunityFilterByType: async(filters?:{start_year?:number,end_year?:number})=>{
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/opportunity/type-opportunity-in-year?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getOpportunityByPriceQuote: async()=>{
    try {
     
      const response = await api.get(`/opportunity/have-price-quote`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getOpportunityHaveContract: async(filters?:{start_year?:number,end_year?:number})=>{
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const response = await api.get(`/opportunity/have-contract?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getOpportunityDashReason: async()=>{
    try {
     
      const response = await api.get(`/opportunity/dashboard-reason`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

export default opportunityService;
