import { UploadFile } from "antd";

interface Customer {
  customer_id: string;
  full_name: string;
  email: string;
}

interface InfoContact {
  info_contact_id: string;
  status: boolean;
  customer: Customer;
}

export interface ICreateAccountCustomers {
  full_name: string;
  email: string;
  password: string;
  position?: string;
  customer_info?: string;
  picture_url?: UploadFile[];
  gender?: "male" | "female" | "other";
  phone_number?: string;
  date_of_birth?: Date;
  status?: "active" | "delete" | "hide";
}

export interface IAccountCustomers {
  customer_id: string;
  full_name: string;
  email: string;
  password?: string;
  position: string;
  picture_url: string;
  gender: "male" | "female" | "other";
  phone_number: string;
  date_of_birth: Date;
  date_contact?: Date;
  status: "active" | "delete" | "hide";
}
export interface IUpdateAccountCustomers {
  full_name?: string;
  email?: string;
  password?: string;
  position?: string;
  picture_url?: UploadFile[];
  gender?: "male" | "female" | "other";
  phone_number?: string;
  date_of_birth?: Date;
  date_contact?: Date;
  status?: "active" | "delete" | "hide";
}
interface GroupCustomer {
  group_id: string;
  name_group: string;
  count: number;
}

interface CustomerInfo {
  info_id: string;
  name_company: string;
  tax_code: string;
  province: string;
  phone_number: string;
  website: string;
  type_money: string;
  status_active: string;
  date_establish: string;
  address_payment: string;
  address_delivery: string;
  province_payment: string;
  province_delivery: string;
  staff_support: string;
  created_at: string;
  updated_at: string;
  group_customer: GroupCustomer;
  infoContacts: InfoContact[];
  picture_url?: string;
}

interface GroupInfo {
  group_id: string;
  name_group: string;
  count: number;
}

export interface CreateGroupCustomer {
  name_group: string;
}

export interface UpdateGroupCustomer {
  name_group: string;
}

interface CreateInfoCustomer {
  name_company: string;
  group_customer: string; // UUID
  tax_code: string;
  province: string;
  phone_number: string;
  website: string;
  type_money: string;
  address_payment: string;
  address_delivery: string;
  province_payment: string;
  province_delivery: string;
  staff_support: string;
  picture_url?: UploadFile[];
}

interface IUpdateCustomerInfo {
  info_id?: string;
  name_company?: string;
  group_customer?: string;
  tax_code?: string;
  province?: string;
  phone_number?: string;
  website?: string;
  type_money?: "vnd" | "usd";
  date_establish?: Date;
  address_payment?: string;
  address_delivery?: string;
  province_payment?: string;
  province_delivery?: string;
  status_active?: "active" | "inactive";
  staff_support?: string;
  picture_url?: UploadFile[];
}
interface ICustomerStatistics {
  totalCustomer: number;
  totalActive: number;
  totalInActive: number;
  contactActive: number;
  contactInactive: number;
  contactActiveToday: number;
}
export type {
  CustomerInfo,
  GroupInfo,
  CreateInfoCustomer,
  IUpdateCustomerInfo,
  ICustomerStatistics,
};
