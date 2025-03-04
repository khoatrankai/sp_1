
import { FilterPriceQuote, ICreatePriceQuote } from '@/models/priceQuoteInterface';
import api from './api';
import { handleError } from '@/utils/error';

const priceQuoteService = {
  createPriceQuote: async (data:ICreatePriceQuote) => {
try{
    const response = await api.post(`/price_quote`,data);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  updatePriceQuote: async (id:string,data:ICreatePriceQuote) => {
try{
    const response = await api.put(`/price_quote/id/${id}`,data);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  updateStatusListPriceQuote: async (listPriceQuote:{price_quote_id:string,status:string}[]) => {
try{
    const response = await api.put(`/price_quote/list`, listPriceQuote);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  getPriceQuotes: async (filters?: FilterPriceQuote) => {
try{
    const queryParams = new URLSearchParams();
  
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
    }
  
    const response = await api.get(`/price_quote/all?${queryParams.toString()}`);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  getPriceQuoteByOpportunityID: async (id:string) => {
    try{
      
      
        const response = await api.get(`/price_quote/by-opportunity/${id}`);
        return response.data;
        }catch(error){
          handleError(error)
          throw error
        }
      },
  deletePriceQuotes: async (datas: string[]) => {
try{
    const response = await api.delete(`/price_quote`, {data:datas});
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  getPriceQuoteID: async (id:string) => {
try{
   
    const response = await api.get(`/price_quote/id/${id}`);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  getPriceQuoteDashboard: async () => {
    try{
       
        const response = await api.get(`/price_quote/dashboard`);
        return response.data;
        }catch(error){
          handleError(error)
          throw error
        }
      },
      getPriceQuoteRevenueByName: async (name:string) => {
        try{
           
            const response = await api.get(`/price_quote/revenue-by-name?name=${name}`);
            return response.data;
            }catch(error){
              handleError(error)
              throw error
            }
          }, 
  getExportPriceQuote: async(id:string)=>{
    try{
    const response = await api.get(`/price_quote/export/${id}`);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  getTypePackages: async()=>{
    const response = await api.get(`/price_quote/type-package`);
    return response.data;
  },
  createTypePackage: async(data:{name_package:string})=>{
    const res = await api.post('/price_quote/type-package', data);
    if (!res) {
        throw new Error("Failed to create type_package price_quote: No response");
    }
    return res.data ;
  },
  updateTypePackage: async(type_package_id:string,data:string)=>{
    const res = await api.put(`/price_quote/type-package/${type_package_id}`, {name_package:data});
    if (!res) {
        throw new Error("Failed to update type_package product: No response");
    }
    return res.data ;
  },
  deleteTypePackage: async (datas: string[]) => {
    const response = await api.delete(`/price_quote/type-package`, {data:datas});
    return response.data;
  },


};

export default priceQuoteService;