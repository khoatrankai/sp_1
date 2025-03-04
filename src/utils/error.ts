import { toast } from "react-toastify";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleError = (error: any) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    const status = error.response?.status;
    toast.dismiss()
    if (status === 403) {
      toast.error('Bạn không có quyền');
    } else {
      toast.error(message);
    }
  };