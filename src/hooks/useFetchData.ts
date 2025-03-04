import { ApiResponse } from '@/models/responseInterface';
import { useEffect, useState } from 'react';

const useFetchData = <T>(fetchFunction:()=> Promise<ApiResponse<T>>) => {
  const [response, setResponse] = useState<ApiResponse<T> |null > (null);
  const [data,setData] = useState< T | null>(null)
  const [message,setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchFunction();
      if ('data' in result) {
        setResponse(result);
          setData(result.data)

      
        
      } else {
        if(result.statusCode === 200 || result.statusCode === 201){
          setMessage(result.message)
        }else{
          setError(result.message);
        }
      }
    } catch  {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = ()=>{
    fetchData()
  }
  useEffect(() => {
 

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFunction]);

  return { data,response,message, loading, error,refreshData };
};

export default useFetchData;