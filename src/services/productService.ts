import { PostResponse } from "@/models/responseInterface";
import api, { api_formdata } from "./api";
import {
  ICreateActivityContainer,
  ICreateClassifyType,
  ICreateCommentReport,
  ICreateSupplierProduct,
  ITypeProduct,
  IUpdateActivityContainer,
  IUpdateSupplierProduct,
} from "@/models/productInterface";
import { toast } from "react-toastify";

const productService = {
  getProducts: async () => {
    const response = await api.get(`/product/all`);
    return response.data;
  },
  deleteProducts: async (datas: string[]) => {
    const response = await api.delete(`/product`, { data: datas });
    return response.data;
  },
  getAboutProduct: async () => {
    const response = await api.get(`/product/about`);
    return response.data;
  },
  getProductID: async (product_id: string) => {
    const response = await api.get(`/product/id/${product_id}`);
    return response.data;
  },
  getProductsID: async (product_id: string) => {
    const response = await api.get(`/product/code/all/${product_id}`);
    return response.data;
  },
  deletePictureProduct: async (data: string[]) => {
    const response = await api.delete(`/product/picture`, { data });
    return response.data;
  },
  getUnits: async () => {
    const response = await api.get(`/product/unit`);
    return response.data;
  },
  getTypes: async () => {
    const response = await api.get(`/product/type`);
    return response.data;
  },
  createType: async (data: ITypeProduct) => {
    const res = await api.post("/product/type", data);
    if (!res) {
      throw new Error("Failed to create type product: No response");
    }
    return res.data;
  },
  getClassifies: async () => {
    const response = await api.get(`/product/classify_type`);
    return response.data;
  },
  getNameClassifies: async () => {
    const response = await api.get(`/product/classify_type_name/expense`);
    return response.data;
  },
  createClassify: async (data: ICreateClassifyType) => {
    const res = await api.post("/product/classify_type", data);
    if (!res) {
      throw new Error("Failed to create classify_type product: No response");
    }
    return res.data;
  },
  updateClassify: async (classify_id: string, data: ICreateClassifyType) => {
    const res = await api.put(`/product/classify_type/${classify_id}`, data);
    if (!res) {
      throw new Error("Failed to update classify_type product: No response");
    }
    return res.data;
  },
  getBrands: async () => {
    const response = await api.get(`/product/brand`);
    return response.data;
  },
  createBrand: async (data: { name: string }) => {
    const res = await api.post("/product/brand", data);
    if (!res) {
      throw new Error("Failed to create brand product: No response");
    }
    return res.data;
  },
  updateBrand: async (brand_id: string, data: string) => {
    const res = await api.put(`/product/brand/${brand_id}`, { name: data });
    if (!res) {
      throw new Error("Failed to update brand product: No response");
    }
    return res.data;
  },
  getOriginals: async () => {
    const response = await api.get(`/product/original`);
    return response.data;
  },
  createOriginal: async (data: { name: string }) => {
    const res = await api.post("/product/original", data);
    if (!res) {
      throw new Error("Failed to create original product: No response");
    }
    return res.data;
  },
  updateOriginal: async (original_id: string, data: string) => {
    const res = await api.put(`/product/original/${original_id}`, {
      name: data,
    });
    if (!res) {
      throw new Error("Failed to update original product: No response");
    }
    return res.data;
  },
  createUnit: async (data: { name_unit: string }) => {
    const res = await api.post("/product/unit", data);
    if (!res) {
      throw new Error("Failed to create unit product: No response");
    }
    return res.data;
  },

  updateUnit: async (unit_id: string, data: string) => {
    const res = await api.put(`/product/unit/${unit_id}`, { name_unit: data });
    if (!res) {
      throw new Error("Failed to update unit product: No response");
    }
    return res.data;
  },
  updateType: async (type_id: string, data: ITypeProduct) => {
    const res = await api.put(`/product/type/${type_id}`, data);
    if (!res) {
      throw new Error("Failed to update unit product: No response");
    }
    return res.data;
  },
  createProduct: async (formdata: FormData): Promise<PostResponse | null> => {
    const res = await api_formdata.post("/product/new", formdata);
    if (!res) {
      throw new Error("Failed to create product: No response");
    }
    return res.data;
  },
  getCodeID: async (url: string) => {
    try {
      const res = await api.get(`/product/code_url?url=${url}`);
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      if (res.data.statusCode !== 200) {
        toast.error(res.data.message);
      }
      return res.data;
    } catch {
      toast.error("Sản phẩm đã xuất kho hoặc không tồn tại");
    }
  },
  getCodeStatusByURL: async (url: string) => {
    try {
      const res = await api.get(`/product/status-code_url?url=${url}`);
      if (!res) {
        throw new Error("Failed to create product: No response");
      }
      if (res.data.statusCode !== 200) {
        toast.error(res.data.message);
      }
      return res.data;
    } catch {
      toast.error("Sản phẩm đã xuất kho hoặc không tồn tại");
    }
  },
  createCodeProduct: async (id: string) => {
    const res = await api.post("/product/code", { product: id });
    if (!res) {
      throw new Error("Failed to create product: No response");
    }
    return res.data;
  },
  updateProductInfo: async (
    id: string,
    data: FormData,
    deleteImg: string[]
  ) => {
    const res = await api_formdata.put(`/product/id/${id}`, data);
    if (deleteImg.length > 0) {
      await api.delete(`/product/picture`, { data: deleteImg });
    }
    if (!res) {
      throw new Error("Failed to create product: No response");
    }
    return res.data;
  },
  updateStatusProduct: async (id: string, status: string) => {
    const res = await api.put(`/product/status/id/${id}`, { status });
    if (!res) {
      throw new Error("Failed to update product: No response");
    }
    return res.data;
  },
  pushImageProduct: async (formdata: FormData) => {
    const res = await api_formdata.post("/product/picture/push", formdata);
    if (!res) {
      throw new Error("Failed to create product: No response");
    }
    return res.data;
  },
  createSupplier: async (data: ICreateSupplierProduct) => {
    const res = await api.post("/product/supplier", data);
    if (!res) {
      throw new Error("Failed to create supplier product: No response");
    }
    return res.data;
  },

  deleteSupplier: async (datas: string[]) => {
    const response = await api.delete(`/product/supplier`, { data: datas });
    return response.data;
  },

  getAllSuppliers: async () => {
    const res = await api.get("/product/supplier");
    if (!res) {
      throw new Error("Failed to fetch suppliers: No response");
    }
    return res.data;
  },

  getSupplierById: async (id: string) => {
    const res = await api.get(`/product/supplier/${id}`);
    if (!res) {
      throw new Error(`Failed to fetch supplier with ID ${id}: No response`);
    }
    return res.data;
  },

  updateSupplier: async (id: string, data: IUpdateSupplierProduct) => {
    const res = await api.put(`/product/supplier/${id}`, data);
    if (!res) {
      throw new Error(`Failed to update supplier with ID ${id}: No response`);
    }
    return res.data;
  },
  createActivityContainer: async (data: ICreateActivityContainer) => {
    const res = await api.post("/product/activity_container", data);
    if (!res) {
      throw new Error("Failed to create activity container: No response");
    }
    return res.data;
  },

  findAllActivityContainers: async (type: "import" | "export" | "status") => {
    const res = await api.get(`/product/activity_container?type=${type}`);
    if (!res) {
      throw new Error("Failed to fetch activity containers: No response");
    }
    return res.data;
  },

  findActivityContainerById: async (id: string) => {
    const res = await api.get(`/product/activity_container/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },

  updateActivityContainer: async (
    id: string,
    data: IUpdateActivityContainer
  ) => {
    const res = await api.put(`/product/activity_container/${id}`, data);
    if (!res) {
      throw new Error(
        `Failed to update activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },

  findCodeByID: async (id: string) => {
    const res = await api.get(`/product/product-code/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },
  createReport: async (description: string, code_product: string) => {
    const res = await api.post(`/product/report`, {
      description,
      code_product,
    });
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID: No response`
      );
    }
    return res.data;
  },
  updateReportStatus: async (
    id: string,
    status: "pending" | "analysis" | "progress" | "testing" | "resolve"
  ) => {
    const res = await api.put(`/product/report-status/${id}`, { status });
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID: No response`
      );
    }
    return res.data;
  },
  findAllReportByCode: async (id: string) => {
    const res = await api.get(`/product/report-code/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },
  findAllCommentByReport: async (id: string) => {
    const res = await api.get(`/product/comment-report/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },
  findAllCommentByCode: async (id: string) => {
    const res = await api.get(`/product/comment-report/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },

  toggleLikeReport: async (status: boolean, history_report: string) => {
    if (status) {
      const res = await api.delete(`/product/like-report/${history_report}`);
      if (!res) {
        throw new Error(
          `Failed to fetch activity container with ID  No response`
        );
      }
      return res.data;
    } else {
      const res = await api.post(`/product/like-report`, { history_report });
      if (!res) {
        throw new Error(
          `Failed to fetch activity container with ID  No response`
        );
      }
      return res.data;
    }
  },
  createCommentReport: async (data?: ICreateCommentReport) => {
    const res = await api.post(`/product/comment-report`, data);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID  No response`
      );
    }
    return res.data;
  },
  deleteCommentReport: async (id?: string) => {
    const res = await api.delete(`/product/comment-report/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID  No response`
      );
    }
    return res.data;
  },
  findAllHistoryByCode: async (id: string) => {
    const res = await api.get(`/product/history-code/${id}`);
    if (!res) {
      throw new Error(
        `Failed to fetch activity container with ID ${id}: No response`
      );
    }
    return res.data;
  },
  findProductByType: async (filters: {
    name_tag: string;
    page: number;
    limit: number;
  }) => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const res = await api.get(
      `/product/get-products?${queryParams.toString()}`
    );
    if (!res) {
      throw new Error(`Failed to fetch product`);
    }
    return res.data;
  },
};

export default productService;
