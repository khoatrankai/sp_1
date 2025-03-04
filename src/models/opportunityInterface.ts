import { InfoUser } from "./userInterface";

export interface ICreateOpportunitiesDto {
  type_opportunity: string;
  type_source: string;
  user_support?: string;
  list_label?: string;
  name_contact?: string;
  status: "pending";
  company_name?: string;
  email?: string;
  position?: string;
  address?: string;
  website?: string;
  phone_number?: string;
  province?: string;
  price?: number;
  description?: string;
  latch_date?: Date;
}

export interface IUpdateOpportunitiesDto {
  type_opportunity?: string;
  type_source?: string;
  user_support?: string;
  list_label?: string;
  name_contact?: string;
  status?: "pending" | "success" | "hide" | "delete" | "cancel" | 'send' |'pause';
  company_name?: string;
  email?: string;
  reason?:string
  position?: string;
  address?: string;
  website?: string;
  phone_number?: string;
  province?: string;
  price?: number;
  description?: string;
  latch_date?: Date;
}

export interface IGetOpportunitiesDto {
  opportunity_id: string;
  type_opportunity: IGetTypeOpportunitiesDto;
  type_source: IGetSourcesOpportunityDto;
  user_support?: InfoUser;
  list_label?: string;
  name_contact?: string;
  status: "pending" | "success" | "hide" | "delete" | "cancel"| 'send' | 'pause';
  company_name?: string;
  email?: string;
  position?: string;
  reason?: string;
  address?: string;
  website?: string;
  phone_number?: string;
  province?: string;
  price?: number;
  price_quotes?:number
  contracts?:number
  description?: string;
  latch_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateTypeOpportunitiesDto {
  name: string;
  name_tag: string;
}

// update-type-opportunities.interface.ts
export interface IUpdateTypeOpportunitiesDto {
  name?: string;
  name_tag?: string;
}

// get-type-opportunities.interface.ts
export interface IGetTypeOpportunitiesDto {
  type_opportunity_id: string;
  name: string;
  name_tag: string;
  opportunities?: IGetOpportunitiesDto[];
}

export interface IGetDashboardOpportunityDto {
  type_opportunity_id: string;
  name: string;
  name_tag: string;
  opportunities?: number;
}

export interface ICreateOpportunitySourcesDto {
  name: string;
}

// update-type-sources.interface.ts
export interface IUpdateOpportunitySourcesDto {
  name?: string;
}

// get-type-sources.interface.ts
export interface IGetSourcesOpportunityDto {
  type_source_id: string;
  name: string;
  opportunities?: IGetOpportunitiesDto[];
}
