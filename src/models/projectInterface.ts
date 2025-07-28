import { UploadFile } from "antd";
import { CustomerInfo } from "./customerInterface";
import { InfoUser } from "./userInterface";
import { IGetPictureWork } from "./activityInterface";

export interface IGetProject {
    project_id: string;
    name?: string;
    status: 'waiting' | 'start' | 'pause' | 'cancel' | 'completed';
    price?: number;
    type?:ITypeProject
    time_job?: number;
    user_support?: string;
    progress:{total:number,completed:number,pause:number,cancel:number,process:number,waiting:number}
    attach:IGetPictureWork[]
    user_participants?:InfoUser[]
    customer?: CustomerInfo;
    start_date?: Date;
    end_date?: Date;
    description?: string;
    picture_url?:string
    created_at: Date;
    updated_at: Date;
  }

  export interface ITypeProject {
    type_id: string;
      name_type: string;
      projects?:IGetProject[]
  }

  export interface ICreateProject {
    name: string;
    status: 'waiting' | 'start' | 'pause' | 'cancel' | 'completed';
    price?: number;
    type?:string;
    time_job?: number;
    user_support?: string;
    customer: string;
    start_date?: Date;
    end_date?: Date;
    description?: string; 
    picture_url?: UploadFile[];
  }

  export interface IUpdateProject {
    name?: string;
    status?: 'waiting' | 'start' | 'pause' | 'cancel' | 'completed';
    price?: number;
    time_job?: number;
    type?:string;
    user_support?: string;
    customer?: string;
    start_date?: Date;
    end_date?: Date;
    description?: string; 
    picture_url?: UploadFile[];
  }

  export interface ICreateNotify {
    description: string;
    url:string;
    project:string;
  }

  export interface IGetNotify {
    notify_id: string;
    description: string;
    user_create:InfoUser;
    url:string;
    created_at: Date;
    updated_at: Date;
  }

  export interface ICreateContractor {
  name: string;
  customer?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_code?: string;
  rating?: number;
  notes?: string;
}

export interface IUpdateContractor {
  name?: string;
  customer?: string;
  phone?: string;
  email?: string;
  address?: string;
  tax_code?: string;
  rating?: number;
  notes?: string;
}

export interface IGetContractor {
  id: string;
  name: string;
  customer?: CustomerInfo;
  phone?: string;
  email?: string;
  address?: string;
  tax_code?: string;
  rating?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateChat {
  name_one?: string
  name_two?: string
  user_one?: string
  user_two?: string
  project?:string
}

export interface CreateChatGroup {
  name: string
  description: string
  head?: string
  project?: string
  members?: string[]
}
export interface CreateMessage {
  content?: string
  user?: string
  user_seen?: string[]
  link?: string
}

export interface IRoleProject {
  role_id?: string;
  name: string;
  name_tag: string;
  created_at?: Date;
  updated_at?: Date;
}
  
  