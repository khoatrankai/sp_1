import {
  ICreateContract,
  ICreatePayment,
  ICreateTypeContract,
  ICreateTypeMethod,
  IUpdateContract,
  IUpdatePayment,
  IUpdateTypeContract,
  IUpdateTypeMethod,
} from "@/models/contractInterface";
import api, { api_formdata } from "./api"; // Ensure `api` is your Axios instance configured with baseURL and interceptors
import { handleError } from "@/utils/error";

const contractService = {
  // Get all contracts
  getContracts: async () => {
    try {
      const response = await api.get(`/contract/all`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getContractAbout: async () => {
    try {
      const response = await api.get(`/contract/about`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getYearContracts: async (filters?: { year?: number; customer?: string }) => {
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
        `/contract/all/filter?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getContract: async (id: string) => {
    try {
      const response = await api.get(`/contract/id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Create a new contract
  createContract: async (data: ICreateContract) => {
    try {
      const response = await api.post(`/contract/create`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteContract: async (datas: string[]) => {
    try {
      const response = await api.delete(`/contract`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // Update an existing contract
  updateContract: async (id: string, data: IUpdateContract) => {
    try {
      const response = await api.put(`/contract/update/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypeContracts: async () => {
    try {
      const response = await api.get(`/contract/type-contract`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getTypeFullContracts: async () => {
    try {
      const response = await api.get(`/contract/full-type-contract`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFullContractDashboard: async () => {
    try {
      const response = await api.get(`/contract/dashboard`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getContractDashboardByProject: async (id:string) => {
    try {
      const response = await api.get(`/contract/dashboard-by-project/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getDebtSupplier: async () => {
    try {
      const response = await api.get(`/contract/debt-supplier`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getPaymentContractDashboard: async () => {
    try {
      const response = await api.get(`/contract/payment-contract-dashboard`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getPaymentExpiredCustomer: async () => {
    try {
      const response = await api.get(`/contract/payment-expired-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getPaymentReadyCustomer: async () => {
    try {
      const response = await api.get(`/contract/payment-ready-customer`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getPaymentReadySupplier: async () => {
    try {
      const response = await api.get(`/contract/payment-ready-supplier`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getRevenueTotal: async () => {
    try {
      const response = await api.get(`/contract/revenue-total-contract`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getYearCurrentContracts: async () => {
    try {
      const response = await api.get(`/contract/current-year`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getFullContractByTypeID: async (id: string) => {
    try {
      const response = await api.get(`/contract/contract-by-type-id/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // Create a new type contract
  createTypeContract: async (data: ICreateTypeContract) => {
    try {
      const response = await api.post(`/contract/type-contract`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Update a type contract
  updateTypeContract: async (id: string, data: IUpdateTypeContract) => {
    try {
      const response = await api.put(`/contract/type-contract/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Create a new payment
  createPayment: async (data: ICreatePayment) => {
    try {
      const response = await api.post(`/contract/payment`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deletePayment: async (datas: string[]) => {
    try {
      const response = await api.delete(`/contract/payment`, { data: datas });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  // Update an existing payment
  updatePayment: async (id: string, data: IUpdatePayment) => {
    try {
      const response = await api.put(`/contract/payment/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getPaymentByProject: async (id: string) => {
    try {
      const response = await api.get(`/contract/payment-by-project/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get all payments
  getAllPayments: async (filters?: {
    type?: string;
    date_start?: string;
    date_end?: string;
    status?: string;
    supplier?: string;
    contract?: string;
    customer?: string;
    typeDate?: "month" | "quarter" | "year";
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
        `/contract/payment?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Create a new type method
  createTypeMethod: async (data: ICreateTypeMethod) => {
    try {
      const response = await api.post(`/contract/type-method`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Update an existing type method
  updateTypeMethod: async (id: string, data: IUpdateTypeMethod) => {
    try {
      const response = await api.put(`/contract/type-method/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get all type methods
  getAllTypeMethods: async () => {
    try {
      const response = await api.get(`/contract/type-method`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  getDocumentContractById: async (id: string) => {
    try {
      const response = await api.get(`/contract/document/all/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  createDocumentContract: async (data: FormData) => {
    try {
      const response = await api_formdata.post(
        "/contract/document/create",
        data
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  deleteDocumentContract: async (id: string) => {
    try {
      const response = await api.delete(`/contract/document/delete?id=${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  getContractsFilterbyProject: async (filters:{id:string}) => {
   

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
        `/contract/get-contract-filter-by-project?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Get a welcome message (optional)
};

export default contractService;
