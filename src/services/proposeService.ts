import { CreatePropose, FilterPropose } from '@/models/proposeInterface';
import api from './api';
import { handleError } from '@/utils/error';

const proposeService = {
  createPropose: async (data:CreatePropose) => {
try{
    const response = await api.post(`/propose`,{...data,price:Number(data.price)});
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },
  getFilterPropose: async (filterPropose:FilterPropose) => {
try{
    const response = await api.get(`/propose/get-filter?${filterPropose.type?`type=${filterPropose.type}`:''}${filterPropose.type_date ? `&type_date=${filterPropose.type_date}` : ''}${filterPropose.status ? `&status=${filterPropose.status}` : ''}${filterPropose.date_start ? `&date_start=${filterPropose.date_start}` : ''}${filterPropose.date_end ? `&date_end=${filterPropose.date_end}` : ''}${filterPropose.staff_support ? `&staff_support=${filterPropose.staff_support}` : ''}`);
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },


};

export default proposeService;