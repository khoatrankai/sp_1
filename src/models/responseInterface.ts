interface SuccessResponse<T> {
    statusCode: number;
    message?:string
    data: T;
  }

  interface DataStateRedux<T> {
    datas: T;
    loading: boolean;
    error: string | null;
  }
  
  
  interface ErrorResponse {
    statusCode: number;
    message: string;
  }

  interface PostResponse {
    statusCode: number;
    message: string;
  }
  interface QRResponse {
    statusCode: number;
    data: object;
  }
  
  type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;


  export type {ApiResponse,PostResponse,QRResponse,DataStateRedux}