import { PostResponse } from "@/models/responseInterface";
import { useState } from "react";
import { toast } from "react-toastify";

const usePostData = () => {
  const [response, setResponse] = useState<PostResponse | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const postdata = async (postFunction: () => Promise<PostResponse | null>) => {
    const toastId = toast.loading("Processing...");
    try {
      const result = await postFunction();

      if (result) {
        // Check if result is not null
        setResponse(result);
        setStatusCode(result.statusCode);
        if (result.statusCode === 200 || result.statusCode === 201) {
          toast.update(toastId, {
            render: result.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return result.statusCode;
        } else {
          toast.update(toastId, {
            render: result.message,
            type: "error",
            isLoading: false,
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        return result.statusCode;
      } else {
        // Handle the null case
        toast.update(toastId, {
          render: "No response received.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return null;
      }
    } catch {
      toast.update(toastId, {
        render: "An unexpected error occurred",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return { postdata, statusCode, response };
};

export default usePostData;
