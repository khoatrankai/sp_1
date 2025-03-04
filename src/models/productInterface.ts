import { CustomerInfo } from "./customerInterface";
import { ICreateListDetailProduct } from "./priceQuoteInterface";
import { InfoUser } from "./userInterface";

interface ProductInfo {
  product_id: string;
  name: string;
  type: string;
  price: number;
  profit: string;
  code_original: string;
  description: string;
  vat: string;
  brand: string;
  original: string;
  quantity: number;
  unit_product: string;
  warranty?: number;
  status: "active" | "delete" | "hide";
  images?: File[];
  supplier_product?: string;
}

interface IPictureUrl {
  picture_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface IGetProductInfo {
  product_id: string;
  name: string;
  type: ITypeProduct; // ID hoặc chi tiết loại sản phẩm
  price: number;
  profit?: string;
  code_original?: string;
  description: string;
  customer?:string,
  opportunity?:string
  vat?: string; // VAT của sản phẩm
  key?: number;
  warranty?: number;
  ikey?: number;
  brand?: IBrand; // VAT của sản phẩm
  original?: IOriginal; // VAT của sản phẩm
  vat_borrowed?: string;
  profit_borrowed?: string;
  children?: ICreateListDetailProduct[];
  quantity: number;
  unit_product: IUnitProduct; // ID hoặc chi tiết đơn vị sản phẩm
  status: "active" | "delete" | "hide";
  supplier_product: IGetSupplierProduct; // ID hoặc chi tiết nhà cung cấp
  picture_urls: IPictureUrl[]; // Danh sách URL hình ảnh
  code_product: IGetCodeProduct[]; // Danh sách mã sản phẩm
  details?: IGetListDetail[];
}

export interface ICreateListDetail {
  title?: string;
  description?: string;
}

export interface IUpdateListDetail {
  title?: string;
  description?: string;
}

export interface IGetListDetail {
  detail_id?: string;
  title?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface IUnitProduct {
  unit_id: string;
  name_unit: string;
}
interface ITypeProduct {
  type_product_id: string;
  name: string;
  name_tag: string;
  description: string;
  classify_type: IGetClassifyType;
}

export interface IGetClassifyType {
  classify_id?: string;
  name: string;
  description: string;
  types_product?: ITypeProduct[];
}

export interface ICreateClassifyType {
  name: string;
  description: string;
}

export interface IBrand {
  brand_id: string;
  name: string;
}

export interface IOriginal {
  original_id: string;
  name: string;
}
export interface IGetCodeProduct {
  code_product_id: string;
  code: string;
  status:
    | "selled"
    | "borrowed"
    | "inventory"
    | "export"
    | "warranty"
    | "maintenance";
  product: IGetProductInfo; // ID hoặc chi tiết sản phẩm
  created_at: Date;
  updated_at: Date;
  history?: IGetHistoryCodeProduct[]; // Lịch sử của mã sản phẩm
  time_warranty?: number;
  warranty_start?: Date;
  warranty_end?: Date;
}

export interface ICreateCodeProduct {
  code_product_id?: string; // Optional
  code?: string; // Optional
  status?:
    | "selled"
    | "borrowed"
    | "inventory"
    | "export"
    | "warranty"
    | "maintenance"; // Optional
  product: string; // ID của sản phẩm, bắt buộc
}

export interface IUpdateCodeProduct {
  status?:
    | "selled"
    | "borrowed"
    | "inventory"
    | "export"
    | "warranty"
    | "maintenance"; // Optional
}

export interface IGetActivityContainer {
  activity_container_id: string;
  type: "import" | "export" | "status";
  user?: string;
  customer?: string;
  activity?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  list_code: IGetHistoryCodeProduct[];
}

export interface IUpdateActivityContainer {
  user?: string;
  customer?: string;
  activity?: string;
  description?: string;
}

export interface ICreateActivityContainer {
  type: "import" | "export" | "status";
  user?: string;
  activity?: string;
  customer?: string;
  description?: string;
  list_code?: Array<{
    price: number;
    code: string;
    status:
      | "selled"
      | "borrowed"
      | "inventory"
      | "warranty"
      | "maintenance"
      | "export";
    vat?: string;
    profit?: string;
    date_expired?: Date;
  }>;
  list_product?: Array<{
    quantity: number;
    product: string;
    price: number;
  }>;
}

export interface ICreateHistoryCodeProduct {
  history_id: string;
  status:
    | "selled"
    | "borrowed"
    | "inventory"
    | "export"
    | "warranty"
    | "maintenance";
  price?: number; // Default: 0
  code_product: string; // ID of CodeProduct
  activity_container: string; // ID of ActivityContainer
}

export interface IGetHistoryCodeProduct {
  history_id?: string;
  status?:
    | "selled"
    | "borrowed"
    | "inventory"
    | "export"
    | "warranty"
    | "maintenance";
  code_product?: IGetCodeProduct; // Details or ID of CodeProduct
  activity_container?: IGetActivityContainer; // Details or ID of ActivityContainer
  created_at: Date;
  updated_at: Date;
  price?: number;
}

export interface IUpdateHistoryCodeProduct {
  status?:
    | "selled"
    | "borrowed"
    | "inventory"
    | "export"
    | "warranty"
    | "maintenance";
  price?: number;
  code_product?: string; // ID of CodeProduct
  activity_container?: string; // ID of ActivityContainer
}

interface IAboutProduct {
  quantity_product: number;
  quantity_active: number;
  quantity_hide: number;
  quantity_hire: number;
  quantity_stored: number;
  quantity_ordered: number;
}

export interface IGetSupplierProduct {
  supplier_id: string;
  name: string;
  phone_number?: string; // Có thể không tồn tại
  email?: string; // Có thể không tồn tại
  address: string;
  description: string;
  products: ProductInfo; // Danh sách sản phẩm đi kèm với thông tin cơ bản
}

export interface ICreateSupplierProduct {
  supplier_id: string; // Mã nhà cung cấp (bắt buộc)
  name: string; // Tên nhà cung cấp (bắt buộc)
  phone_number?: string; // Số điện thoại (không bắt buộc)
  email?: string; // Email (không bắt buộc)
  address: string; // Địa chỉ (bắt buộc)
  description: string; // Mô tả (bắt buộc)
}

export interface IUpdateSupplierProduct {
  name?: string; // Tên nhà cung cấp
  phone_number?: string; // Số điện thoại
  email?: string; // Email
  address?: string; // Địa chỉ
  description?: string; // Mô tả
}

export type {
  ProductInfo,
  IUnitProduct,
  ITypeProduct,
  IGetProductInfo,
  IPictureUrl,
  IAboutProduct,
};

export interface IGetHistoryReport {
  history_id: string;

  status: "pending" | "analysis" | "progress" | "testing" | "resolve";

  activity: string;

  customer?: CustomerInfo;

  title: string;
  created_at: Date;
  updated_at: Date;
  description: string;
  user_support?: InfoUser;
  code_product: IGetCodeProduct;
  comment: IGetCommentReport[];
  like: IGetLikeReport[];
}

export interface ICreateHistoryReport {
  status?: "pending" | "analysis" | "progress" | "testing" | "resolve";
  activity?: string;
  customer?: string;
  title: string;
  description?: string;
  user_support?: string;
  code_product?: string;
}

export interface IUpdateHistoryReport {
  status?: "pending" | "analysis" | "progress" | "testing" | "resolve";
  activity?: string;
  customer?: string;
  title: string;
  description?: string;
  user_support?: string;
}

export interface IGetCommentReport {
  comment_id: string;
  customer?: CustomerInfo;
  user_support?: InfoUser;
  description: string;
  created_at: Date;
  updated_at: Date;
  history_report: IGetHistoryReport;
}

export interface ICreateCommentReport {
  customer?: string;
  user_support?: string;
  description: string;
  history_report: string;
}

export interface IUpdateCommentReport {
  customer?: string;
  user_support?: string;
  description?: string;
}

export interface IGetLikeReport {
  like_id: string;
  customer?: string;
  user_support?: string;
  created_at: Date;
  updated_at: Date;
  history_report: IGetHistoryReport;
}

export interface ICreateLikeReport {
  customer?: string;
  user_support?: string;
  history_report?: string;
}
