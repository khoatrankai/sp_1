import { CustomerInfo } from "./customerInterface";
import { IGetSupplierProduct, ITypeProduct } from "./productInterface";
import { IGetProject } from "./projectInterface";

export interface ICreateContract {
  name_contract: string;
  project: string;
  customer: string;
  price: number;
  type: "default" | "time";
  times?: number;
  type_contract: string; // Should reference `type_id` from TypeContract
  date_start: Date;
  date_expired: Date;
  status?: "delete" | "active" | "hide" | "completed";
  description?: string;
}

export interface IGetContract {
  contract_id: string;
  name_contract?: string;
  code_contract?: string;
  project?: IGetProject;
  customer?: CustomerInfo;
  price?: number;
  type?: "default" | "time";
  times?: number;
  type_contract?: IGetTypeContract; // Should reference `type_id` from TypeContract
  date_start?: Date;
  date_expired?: Date;
  status?: "delete" | "active" | "hide" | "completed";
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUpdateContract {
  name_contract?: string;
  project?: string;
  customer?: string;
  price?: number;
  type?: "default" | "time";
  times?: number;
  type_contract?: string; // Should reference `type_id` from TypeContract
  date_start?: Date;
  date_expired?: Date;
  status?: "delete" | "active" | "hide" | "completed";
  description?: string;
}

export interface ICreatePayment {
  payment_id: string;
  contract: string; // Should reference `contract_id` from Contract
  status: "pending" | "fail" | "success";
  price: number;
  vat: string;
  description: string;
  type_product: string;
  supplier: string;
  type: string;
  date_expired: Date;
  type_method: string; // Should reference `type_method_id` from TypeMethod
}

export interface IGetPayment {
  payment_id?: string;
  contract?: IGetContract; // Should reference `contract_id` from Contract
  status?: "pending" | "fail" | "success";
  price?: number;
  vat: string;
  description: string;
  type_product: ITypeProduct;
  supplier: IGetSupplierProduct;
  type: string;
  date?: string;
  date_expired?: Date;
  created_at?: Date;
  updated_at?: Date;
  type_method?: string; // Should reference `type_method_id` from TypeMethod
}

export interface IUpdatePayment {
  contract?: string; // Should reference `contract_id` from Contract
  status?: "pending" | "fail" | "success";
  price?: number;
  vat?: string;
  description?: string;
  type_product?: string;
  supplier?: string;
  type?: string;
  date_expired?: Date;
  type_method?: string; // Should reference `type_method_id` from TypeMethod
}

export interface ICreateTypeContract {
  type_id: string;
  name_type: string;
  count?: number;
}

export interface IGetTypeContract {
  type_id?: string;
  name_type?: string;
  count?: number;
  contracts?: IGetContract[];
}

export interface IUpdateTypeContract {
  name_type?: string;
  count?: number;
}

export interface ICreateTypeMethod {
  type_method_id: string;
  name: string;
  name_tag: string;
}

export interface IGetTypeMethod {
  type_method_id?: string;
  name?: string;
  name_tag?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IUpdateTypeMethod {
  name?: string;
  name_tag?: string;
}

export interface IGetDocumentContract {
  document_id: string;
  url: string;
  type: string;
  contract: IGetContract;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateDocumentContract {
  contract: string;
  url: File;
}

export interface IUpdateDocumentContract {
  document_id: string;
  url?: string;
  contract?: string;
}
