
import api from './api';
import { handleError } from '@/utils/error';

const aiService = {
  getInfo: async (text:string) => {
try{
    const response = await api.post(`/ai-gemini`,{text});
    return response.data;
    }catch(error){
      handleError(error)
      throw error
    }
  },


};

export default aiService;